AFRAME.registerComponent("input-listen", {
    init: function () {
        let lastHit = null;

        // Wordt geactiveerd zodra raycaster iets raakt
        this.el.addEventListener("raycaster-intersection", (e) => {
            const hits = e.detail.els;
            if (hits && hits.length > 0) {
                lastHit = hits[0];
                console.log("Raycaster raakt:", lastHit.id || lastHit.className);
            }
        });

        // Wordt geactiveerd zodra raycaster niets meer raakt
        this.el.addEventListener("raycaster-intersection-cleared", () => {
            lastHit = null;
        });

        // Trigger indrukken
        this.el.addEventListener("triggerdown", () => {
            if (lastHit) {
                console.log("Grijpt:", lastHit.id || lastHit.className);
                lastHit.setAttribute("color", "yellow");
            } else {
                console.log("Geen object geraakt bij triggerdown");
            }
        });
    }
});


AFRAME.registerComponent('grabber', {
    init: function () {
        this.grabbed = null;

    },
    events: {
        gripdown: function(evt) {
            if (evt.currentTarget.components['raycaster'].intersections.length>0) {
                this.grabbed = evt.currentTarget.components['raycaster'].intersections[0].object.el;
                evt.currentTarget.object3D.attach(this.grabbed.object3D);
            }
        }, gripup: function(evt) {
            if (this.grabbed) {
                this.el.sceneEl.object3D.attach(this.grabbed.object3D);
                this.grabbed = null;
            }
        }
    }
});