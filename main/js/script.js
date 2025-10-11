AFRAME.registerComponent("pinch-detector", {
    schema: { hand: { type: "string" } },
    init: function () {
        this.pinchActive = false;
        this.debugText = document.getElementById("debugText");
    },
    tick: function () {
        /** @type {any} */ const xrSession = this.el.sceneEl.renderer.xr.getSession();

        if (!xrSession) return;

        const handInput = Array.from(xrSession.inputSources).find(
            (s) => s.hand && s.handedness === this.data.hand
        );
        if (!handInput) return;

        const indexTip = handInput.hand.get("index-finger-tip");
        const thumbTip = handInput.hand.get("thumb-tip");
        if (!indexTip || !thumbTip) return;

        const indexPos = new THREE.Vector3().fromArray(indexTip.transform.position);
        const thumbPos = new THREE.Vector3().fromArray(thumbTip.transform.position);
        const dist = indexPos.distanceTo(thumbPos);

        const isPinching = dist < 0.025; // kleiner dan ±2.5 cm

        if (isPinching && !this.pinchActive) {
            this.pinchActive = true;
            this.updateDebug(`🤏 Pinch started (${this.data.hand})`);
        } else if (!isPinching && this.pinchActive) {
            this.pinchActive = false;
            this.updateDebug(`👋 Pinch ended (${this.data.hand})`);
        }
    },
    updateDebug: function (msg) {
        if (this.debugText) this.debugText.setAttribute("value", msg);
    },
});






AFRAME.registerComponent('pinch-logger', {
    schema: { hand: { default: 'left' } },
    init: function () {
        const statusText = document.querySelector('#statusText');
        this.el.addEventListener('pinchstarted', () => {
            statusText.setAttribute('text', 'value', `${this.data.hand} hand pinch started`);
        });
        this.el.addEventListener('pinchended', () => {
            statusText.setAttribute('text', 'value', `${this.data.hand} hand pinch ended`);
        });
    }
});


AFRAME.registerComponent('pinch-debug', {
    init: function () {
        const scene = document.querySelector('a-scene');
        let debugText = document.getElementById('statusText');

        if (!debugText) {
            debugText = document.createElement('a-text');
            debugText.setAttribute('id', 'statusText');
            debugText.setAttribute('value', 'Ready');
            debugText.setAttribute('color', 'yellow');
            debugText.setAttribute('align', 'center');
            debugText.setAttribute('position', '0 -0.3 -1');
            this.el.sceneEl.camera.el.appendChild(debugText);
        }

        this.el.addEventListener('pinchstarted', () => {
            debugText.setAttribute('value', '🤏 Pinch started (' + this.el.id + ')');
        });

        this.el.addEventListener('pinchended', () => {
            debugText.setAttribute('value', '👋 Pinch ended (' + this.el.id + ')');
        });
    }
});
