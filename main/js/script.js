AFRAME.registerComponent("input-listen", {
    init: function () {
        let lastHit = null;

        // Raycaster raakt iets
        this.el.addEventListener("raycaster-intersected", (e) => {
            const hits = e.detail.intersectedEls;
            if (hits && hits.length > 0) {
                lastHit = hits[0];
                console.log("Raycaster raakt:", lastHit.id || lastHit.className);
            }
        });

        // Raycaster raakt niets meer
        this.el.addEventListener("raycaster-intersected-cleared", () => {
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
