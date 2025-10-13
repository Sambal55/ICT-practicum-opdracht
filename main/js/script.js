import {changeDebugMode, log} from './logger.js';

AFRAME.registerComponent('grabber', {
    init: function () {
        this.grabbed = null;
    },
    events: {

        gripdown: function (evt) {
            if (evt.currentTarget.components['raycaster'].intersections.length > 0) {
                log('vasthouden')
                this.grabbed = evt.currentTarget.components['raycaster'].intersections[0].object.el;
                evt.currentTarget.object3D.attach(this.grabbed.object3D);
            }
        }, gripup: function (evt) {
            if (this.grabbed) {
                log('losgelaten')
                this.el.sceneEl.object3D.attach(this.grabbed.object3D);
                this.grabbed = null;
            }
        }
    }
});


AFRAME.registerComponent("debug-toggle", {
    init: function () {
        this.el.addEventListener("abuttondown", () => {
            changeDebugMode();
        });
    }
});