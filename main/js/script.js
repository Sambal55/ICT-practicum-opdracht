AFRAME.registerComponent("input-listen", {
    init: function () {
        // squeeze button in WebXR debugger
        this.el.addEventListener("triggerdown", (e) => {
            console.log("triggerdown", e.target.id);
        });
        // veranderen naar purp if not purp already
        this.el.addEventListener("collide", (e) => {
            const hitEl = e.detail.body.el;
            if (!hitEl) return;

            if (hitEl.getAttribute("color") !== "purple") {
                console.log("collide with", hitEl.id || hitEl.className);
                hitEl.setAttribute("color", "purple");
            }
        });
    }
});
