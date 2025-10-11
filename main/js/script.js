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

AFRAME.registerComponent('hover-color', {
    schema: { color: { type: 'color', default: 'yellow' } },
    init: function () {
        const el = this.el;
        el.addEventListener('mouseenter', () => {
            el.setAttribute('color', this.data.color);
        });
        el.addEventListener('mouseleave', () => {
            el.setAttribute('color', 'blue'); // originele kleur of haal dynamisch uit attribute
        });
    }
});

