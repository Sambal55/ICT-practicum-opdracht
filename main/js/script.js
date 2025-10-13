import {changeDebugMode, log} from './logger.js';

AFRAME.registerComponent('grabber', {
    init: function () {
        this.grabbed = null;
    },
    events: {

        gripdown: function (evt) {
            const gripPoint = evt.currentTarget.querySelector('#gripPoint');
            const rayHits = evt.currentTarget.components['raycaster'].intersections;

            if (rayHits.length > 0) {
                log('vasthouden');
                this.grabbed = rayHits[0].object.el;
                gripPoint.object3D.attach(this.grabbed.object3D);
            }
        }

    }, gripup: function (evt) {
        if (this.grabbed) {
            // Zet terug in de scene
            this.el.sceneEl.object3D.attach(this.grabbed.object3D);
            log('losgelaten')
            // Heractiveer physics
            this.grabbed.removeAttribute("dynamic-body"); // reset
            this.grabbed.setAttribute("dynamic-body", ""); // opnieuw toevoegen

            this.grabbed = null;
        }
    }

})
;


AFRAME.registerComponent("debug-toggle", {
    init: function () {
        this.el.addEventListener("abuttondown", () => {
            changeDebugMode();
        });
    }
});

// aanwijs bolletje op raycaster
AFRAME.registerComponent("hover-indicator", {
    init: function () {
        // Maak het bolletje
        this.indicator = document.createElement("a-sphere");
        this.indicator.setAttribute("radius", "0.03");
        this.indicator.setAttribute("color", "red");
        this.indicator.setAttribute("visible", "false");
        // geen physics voor aanwijsbolletje
        this.indicator.setAttribute("collision-filter", "collisionForces: false");
        this.el.sceneEl.appendChild(this.indicator);

        this.el.addEventListener("raycaster-intersection", (e) => {
            const hits = e.detail.els;
            if (hits && hits.length > 0) {
                const hit = hits[0];
                const hitPos = hit.object3D.getWorldPosition(new THREE.Vector3());
                this.indicator.setAttribute("position", hitPos);
                this.indicator.setAttribute("visible", "true");
            }
        });

        // Verberg als er geen intersectie meer is
        this.el.addEventListener("raycaster-intersection-cleared", () => {
            this.indicator.setAttribute("visible", "false");
        });
    }
});
