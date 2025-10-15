/**
 * This file mostyly contains debug AFRAME attributs which change the statusText or
 * can possibly change the behavior of the objects such as hover-color
 *
 * I was not able to make the grabbing with (hand-gestures) pinch work.
 * So I shifted to working with controllers to be able to grab objects (index.HTML)
 */

// detect if pinch has started and ended and log this into the VR scene
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

// Changes color of object with attribute hover-color, when hovering over it
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
    }
});

// made for the attempt at grabbing objects, does not do anthing atm, because grabbing does not work
AFRAME.registerComponent('grab-debug', {
    init: function () {
        const statusText = document.querySelector('#statusText');

        this.el.addEventListener('grab-start', (evt) => {
            const grabbedEl = evt.detail.el;
            console.log('Grabbed:', grabbedEl.id || grabbedEl.tagName);
            statusText.setAttribute('text', 'value', `Grabbed: ${grabbedEl.id}`);
            grabbedEl.setAttribute('color', 'orange');

        });

        this.el.addEventListener('grab-end', (evt) => {
            const releasedEl = evt.detail.el;
            console.log('Released:', releasedEl.id || releasedEl.tagName);
            statusText.setAttribute('text', 'value', `Released: ${releasedEl.id}`);
            releasedEl.setAttribute('color', releasedEl.getAttribute('hover-color').original);

        });
    }
});

