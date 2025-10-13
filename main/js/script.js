import {changeDebugMode, log} from './logger.js';


AFRAME.registerComponent('grabber', {
    init: function () {
        this.grabbed = null;
        this.lastHit = null;

        const gripPoint = this.el.querySelector('#gripPoint');

        // Raycaster-intersection opslaan
        this.el.addEventListener("raycaster-intersection", (e) => {
            const hits = e.detail.els;
            if (hits && hits.length > 0) {
                this.lastHit = hits[0];
            }
        });

        this.el.addEventListener("raycaster-intersection-cleared", () => {
            this.lastHit = null;
        });

        // Grip indrukken
        this.el.addEventListener("gripdown", () => {
            if (this.grabbed) {
                log("Je hebt al iets vast");
                return;
            }

            if (this.lastHit && this.lastHit.classList.contains("botsen")) {
                this.grabbed = this.lastHit;
                this.grabbed.removeAttribute("dynamic-body");
                gripPoint.object3D.attach(this.grabbed.object3D);
                log("Vastgepakt: " + (this.grabbed.id || this.grabbed.className));
            } else {
                log("Geen botsen object geraakt");
            }
        });

        // Grip loslaten
        this.el.addEventListener("gripup", () => {
            if (!this.grabbed) {
                log("Niets om los te laten");
                return;
            }

            const released = this.grabbed;
            this.grabbed = null;

            // Zet terug in de scene
            this.el.sceneEl.object3D.attach(released.object3D);

            // Behoud wereldpositie
            released.object3D.position.copy(released.object3D.getWorldPosition(new THREE.Vector3()));
            const worldQuat = released.object3D.getWorldQuaternion(new THREE.Quaternion());
            const worldEuler = new THREE.Euler().setFromQuaternion(worldQuat);
            released.object3D.rotation.copy(worldEuler);
            // Heractiveer physics
            setTimeout(() => {
                released.setAttribute("dynamic-body", "");
                log("Losgelaten: " + (released.id || released.className));
            }, 50);
        });
    }
});


AFRAME.registerComponent("debug-toggle", {
    init: function () {
        this.el.addEventListener("abuttondown", () => {
            changeDebugMode();
        });
    }
});

