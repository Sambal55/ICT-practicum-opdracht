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
