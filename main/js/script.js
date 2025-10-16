import {changeDebugMode, log} from './logger.js';

/**
 * Note:
 * To place the cube on the tip of the raycaster, there's an entity in both controllers
 * with the ID: gripPoint. The W3C validator returns an error because of this. But in this instance, it's actually less complex
 * to use the same ID because you're referring to this.el (the controller), and you're looking for #gripPoint there.
 * So this approach works for both the left and right controllers.
 */

AFRAME.registerComponent('grabber', {
    init: function () {
        this.grabbed = null;
        this.lastHit = null;

        const gripPoint = this.el.querySelector('#gripPoint');

        // save raycaster intersection as lastHit
        this.el.addEventListener("raycaster-intersection", (e) => {
            const hits = e.detail.els;
            if (hits && hits.length > 0) {
                this.lastHit = hits[0];
            }
        });

        // reset lastHit
        this.el.addEventListener("raycaster-intersection-cleared", () => {
            this.lastHit = null;
        });

        this.el.addEventListener("gripdown", () => {
            if (this.grabbed) {
                log("You're already holding something");
                return;
            }

            // Check if object is grabbable AND dynamic
            if (
                this.lastHit &&
                this.lastHit.classList.contains("grabbable") &&
                this.lastHit.hasAttribute("dynamic-body")
            ) {
                this.grabbed = this.lastHit;

                // De-activate physics
                this.grabbed.removeAttribute("dynamic-body");
                gripPoint.object3D.attach(this.grabbed.object3D);
                log("Grabbed: " + (this.grabbed.id || this.grabbed.className));
            } else {
                log("Object is not grabbable or not dynamic");
            }
        });

        this.el.addEventListener("gripup", () => {
            if (!this.grabbed) {
                log("No object to release");
                return;
            }

            const released = this.grabbed;
            this.grabbed = null;

            // Place object back in scene
            this.el.sceneEl.object3D.attach(released.object3D);

            // Preserve world position and rotation when releasing object
            released.object3D.position.copy(released.object3D.getWorldPosition(new THREE.Vector3()));
            const worldQuat = released.object3D.getWorldQuaternion(new THREE.Quaternion());
            const worldEuler = new THREE.Euler().setFromQuaternion(worldQuat);
            released.object3D.rotation.copy(worldEuler);

            // Re-activate physics
            setTimeout(() => {
                released.setAttribute("dynamic-body", "");
                log("Released: " + (released.id || released.className));
            }, 50);
        });
    }
});

// attribute for changing to debugMode with the 'x' button with VR
AFRAME.registerComponent("debug-toggle", {
    init: function () {
        this.el.addEventListener("xbuttondown", () => {
            changeDebugMode();
        });
    }
});

// method for changing to debug mode on desktop
document.addEventListener('keydown', function (ev) {
    log("Keydown: " + ev.key)
    if (ev.key === 'q') {
        changeDebugMode();
    }
});
/**
 * for this method it was supposed to work so that a player could stand on boxes when they were in static state
 * And this method works in that way very well. It changes dynamic boxes to static boxes and vice versa.
 * But when you jump onto a static boc, you dont get on top of the box but get inside the box, which is not the point.
 */
AFRAME.registerComponent('change-physics', {
    init: function () {
        this.lastHit = null;

        this.el.addEventListener("raycaster-intersection", (e) => {
            const hits = e.detail.els;
            if (hits && hits.length > 0) {
                this.lastHit = hits[0];
            }
        });
        // reset lastHit
        this.el.addEventListener("raycaster-intersection-cleared", () => {
            this.lastHit = null;
        });

        document.addEventListener('triggerdown', () => {
            if (!this.lastHit || !this.lastHit.classList.contains('grabbable')) return;

            if (this.lastHit.components['body']) {
                this.lastHit.components['body'].remove(); // verwijder physics-body
            }
            if (!this.lastHit) return;
            if (this.lastHit.hasAttribute('dynamic-body')) {
                this.lastHit.removeAttribute('dynamic-body');
                this.lastHit.setAttribute('static-body', {shape: 'box'});
                this.lastHit.setAttribute('material', 'color: black');
                console.log('changed to static');
            } else if (this.lastHit.hasAttribute('static-body')) {
                this.lastHit.removeAttribute('static-body');
                this.lastHit.setAttribute('dynamic-body', {shape: 'box', mass: 20});
                this.lastHit.setAttribute('material', 'color: lime');
                console.log('changed to dynamic');
            }
        });
    }
});


let lastDirection = 0;

/**
 * This method is for checking the direction of the joystick so that when a player jumps
 * the lastDirection is the direction in which the player is going to jump when pressing the a button
 */
AFRAME.registerComponent('joystick-direction', {
    init: function () {
        log('gaat in joystick-direction')
        this.el.addEventListener("thumbstickmoved", (e) => {
            if (e.detail.y < -0.5) {
                lastDirection = -1;
            } else if (e.detail.y > 0.5) {
                lastDirection = 1;
            }
            // last direction is preserved
        });
    }
});

/**
 * This component makes sure that the player can jump
 * It has accounted for the direction of the joystick, the current position values
 * and what direction the camera faces.
 *
 * It uses an animation to make the jump smoother looking.
 */
AFRAME.registerComponent("smooth-jump", {
    init: function () {
        const rig = document.querySelector("#rig");
        const camera = document.querySelector("[camera]");
        const jumpUp = () => {
            const rigPosition = rig.getAttribute("position");
            // camera rotation
            const camDir = new THREE.Vector3();
            camera.object3D.getWorldDirection(camDir);
            const jumpDistance = 1.7;

            const directionX = camDir.x * lastDirection * jumpDistance;
            const directionZ = camDir.z * lastDirection * jumpDistance;

            const targetX = rigPosition.x + directionX;
            const targetZ = rigPosition.z + directionZ;

            // delete so that the animation doesnt already excist
            rig.removeAttribute("animation__jumpup");
            rig.removeAttribute("animation__jumpdown");

            // UP animation
            rig.setAttribute("animation__jumpup", {
                property: "position",
                to: `${targetX} 2 ${targetZ}`,
                dur: 300,
                easing: "easeOutQuad",
                loop: "false"
            });

            // down animation
            setTimeout(() => {
                rig.setAttribute("animation__jumpdown", {
                    property: "position",
                    to: `${targetX} 0 ${targetZ}`,
                    dur: 300,
                    easing: "easeInQuad",
                    loop: "false"
                });
            }, 300);
        };

        // for VR
        this.el.addEventListener("abuttondown", () => {
            jumpUp();
        });

        // for desktop
        window.addEventListener("keydown", (ev) => {
            if (ev.code === "Space") {
                jumpUp();
            }
        });
    }
});










