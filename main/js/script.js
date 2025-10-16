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

            // Check if an object can be grabbed and attach to gripPoint (raycaster)
            if (this.lastHit && this.lastHit.classList.contains("grabbable")) {
                this.grabbed = this.lastHit;

                // De-activate physics
                this.grabbed.removeAttribute("dynamic-body");
                gripPoint.object3D.attach(this.grabbed.object3D);
                log("Grabbed: " + (this.grabbed.id || this.grabbed.className));
            } else {
                log("Object is not in class: grabbable");
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

// attribute for changing to debugMode with the 'x' button
AFRAME.registerComponent("debug-toggle", {
    init: function () {
        this.el.addEventListener("xbuttondown", () => {
            changeDebugMode();
        });
    }
});

document.addEventListener('keydown', function (ev) {
    log("Keydown: " + ev.key)
    if (ev.key === 'q') {
        changeDebugMode();
    }
});

AFRAME.registerComponent('change-physics', {
    init: function () {
        document.addEventListener('triggerdown', () => {
            // Check of entity een dynamic-body heeft
            if (this.el.getAttribute('dynamic-body')) {
                this.el.removeAttribute('dynamic-body');
                this.el.setAttribute('static-body', '');
                this.el.setAttribute('color', 'black');
                log('changed to static')
            }else if(this.el.getAttribute('static-body')){
                this.el.removeAttribute('static-body')
                this.el.setAttribute('dynamic-body')
                this.el.setAttribute('color', 'lime')
                log('changed to dynamic')
            }
        });
    }
});


AFRAME.registerComponent("smooth-jump", {
    init: function () {
        const rig = document.querySelector("#rig");
        const leftController = document.querySelector('#ctlL')
        // -1 = forward, 1 is backwards and 0 is neutral
        let direction = 0;

        // read joystick input
        leftController.addEventListener("thumbstickmoved", (e) => {
            if (e.detail.y < -0.5) {
                // forwards
                direction = -1;
            } else if (e.detail.y > 0.5) {
                // backwards
                direction = 1;
            } else {
                // no joystick input
                direction = 0;
            }
        });

        const jumpUp = () => {
            const pos = rig.getAttribute("position");
            const x = pos.x;
            const z = pos.z;

            const jumpDistance = 1.5;
            // adjust Z value according to current position, direction and jumpdistance
            const targetZ = z + direction * jumpDistance;

            // delete previously made jump animations from rig
            rig.removeAttribute("animation__jumpup");
            rig.removeAttribute("animation__jumpdown");

            rig.setAttribute("animation__jumpup", {
                property: "position",
                to: `${x} 1.3 ${targetZ}`,
                dur: 300,
                easing: "easeOutQuad",
                loop: "false"
            });

            setTimeout(() => {
                rig.setAttribute("animation__jumpdown", {
                    property: "position",
                    to: `${x} 0 ${targetZ}`,
                    dur: 300,
                    easing: "easeInQuad",
                    loop: "false"
                });
            }, 300);
        };

        this.el.addEventListener("abuttondown", () => {
            jumpUp();
        });

        window.addEventListener("keydown", (ev) => {
            if (ev.code === "Space") {
                jumpUp();
            }
        });
    }
});









