AFRAME.registerComponent('grabber', {
    init: function () {
        this.grabbed = null;
        this.lastHit = null;

        // Debugger ophalen
        const debugEl = document.querySelector("#debugDisplay");

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
            if (debugEl && debugEl.components["vr-debugger"]) {
                debugEl.components["vr-debugger"].log("✊ Grip ingedrukt");
            }

            if (this.lastHit && this.lastHit.classList.contains("grabbable")) {
                this.grabbed = this.lastHit;
                this.el.object3D.attach(this.grabbed.object3D);
                if (debugEl && debugEl.components["vr-debugger"]) {
                    debugEl.components["vr-debugger"].log("✅ Gegrepen: " + (this.grabbed.id || this.grabbed.className));
                }
            } else {
                if (debugEl && debugEl.components["vr-debugger"]) {
                    debugEl.components["vr-debugger"].log("⚠️ Geen grabbable object geraakt bij gripdown");
                }
            }
        });

        // Grip loslaten
        this.el.addEventListener("gripup", () => {
            if (this.grabbed) {
                this.el.sceneEl.object3D.attach(this.grabbed.object3D);
                if (debugEl && debugEl.components["vr-debugger"]) {
                    debugEl.components["vr-debugger"].log("🛑 Losgelaten");
                }
                this.grabbed = null;
            }
        });
    }
});
