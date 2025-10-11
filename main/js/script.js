AFRAME.registerComponent('pinch-logger', {
    schema: {hand: {default: 'left'}},
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
        this.el.addEventListener('grab-start', (evt) => {
            const grabbedEl = evt.detail.el;
            console.log('Grabbed:', grabbedEl.id || grabbedEl.tagName);
            debugText.setAttribute('text', 'value', `Grabbed: ${grabbedEl.id || grabbedEl.tagName}`);
        });

        this.el.addEventListener('grab-end', (evt) => {
            const releasedEl = evt.detail.el;
            console.log('Released:', releasedEl.id || releasedEl.tagName);
            debugText.setAttribute('text', 'value', `Released: ${releasedEl.id || releasedEl.tagName}`);
        });
    }
});
AFRAME.registerComponent('hover-color', {
    schema: {
        color: {type: 'color', default: 'yellow'},
        original: {type: 'color', default: 'red'}
    },
    init: function () {
        this.el.addEventListener('raycaster-intersected', () => {
            this.el.setAttribute('color', this.data.color);
        });
        this.el.addEventListener('raycaster-intersected-cleared', () => {
            this.el.setAttribute('color', this.data.original);
        });
        this.el.addEventListener('grab-start', (evt) => {
            const grabbedEl = evt.detail.el;
            grabbedEl.setAttribute('color', 'orange'); // object is vast
        });

        this.el.addEventListener('grab-end', (evt) => {
            const releasedEl = evt.detail.el;
            releasedEl.setAttribute('color', releasedEl.getAttribute('hover-color').original); // terug naar origineel
        });

    }
});


AFRAME.registerComponent('grab-debug', {
    init: function () {
        const statusText = document.querySelector('#statusText');

        this.el.addEventListener('grab-start', (evt) => {
            const grabbedEl = evt.detail.el;
            console.log('Grabbed:', grabbedEl.id || grabbedEl.tagName);
            statusText.setAttribute('text', 'value', `Grabbed: ${grabbedEl.id || grabbedEl.tagName}`);
        });

        this.el.addEventListener('grab-end', (evt) => {
            const releasedEl = evt.detail.el;
            console.log('Released:', releasedEl.id || releasedEl.tagName);
            statusText.setAttribute('text', 'value', `Released: ${releasedEl.id || releasedEl.tagName}`);
        });
    }
});

AFRAME.registerComponent('hover-debug', {
    init: function () {
        const statusText = document.querySelector('#statusText');
        this.el.addEventListener('hover-start', () => {
            statusText.setAttribute('text', 'value', `Hovering: ${this.el.id || this.el.tagName}`);
        });
        this.el.addEventListener('hover-end', () => {
            statusText.setAttribute('text', 'value', `Stopped hovering: ${this.el.id || this.el.tagName}`);
        });
    }
});


