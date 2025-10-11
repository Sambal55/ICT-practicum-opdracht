


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
