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

// attribute for changing to debugMode with the 'a' button
AFRAME.registerComponent("debug-toggle", {
    init: function () {
        this.el.addEventListener("abuttondown", () => {
            changeDebugMode();
        });
    }
});

