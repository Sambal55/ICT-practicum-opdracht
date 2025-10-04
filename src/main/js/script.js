/**
 * Methode voor fysiek bewegen van controller in VR wereld (duwen)
 * met de xbox controller joystick
 */
AFRAME.registerComponent('joystick-hands', {

    init: function () {
        console.log("gamepad-joystick component actief");
    },
    tick: function () {
        const gp = navigator.getGamepads()[0];
        if (!gp) {
            console.log("Geen gamepad gevonden");
            return;
        }

        const leftHand = document.querySelector('#ctlL');
        const rightHand = document.querySelector('#ctlR');
        // Rechter joystick → X en Y
        rightHand.object3D.position.x += gp.axes[2] * 3; // links/rechts
        rightHand.object3D.position.y += gp.axes[3] * -3; // omhoog/omlaag

        // Linker joystick → Z
        rightHand.object3D.position.z += gp.axes[1] * 3; // vooruit/achteruit
    }

});




AFRAME.registerComponent('pickup-box', {
    init: function () {
        this.heldObject = null;
    },

    tick: function () {
        const gp = navigator.getGamepads()[0];
        if (!gp) return;

        const hand = this.el;
        const raycaster = hand.components.raycaster;
        const hits = raycaster.intersections;

        // Oppakken met trigger (RB of RT)
        if (gp.buttons[7]?.pressed && !this.heldObject && hits.length > 0) {
            const target = hits[0].object.el;
            if (target.classList.contains('movingObject')) {
                this.heldObject = target;
                console.log(hand.getAttribute('position'))
                hand.appendChild(target);
                target.setAttribute('position', '0 0 -0.5'); // relatief aan hand
                target.removeAttribute('dynamic-body'); // tijdelijk physics uit
            }
        }

        // Loslaten met LB of LT
        if (gp.buttons[6]?.pressed && this.heldObject) {
            hand.removeChild(this.heldObject);
            this.heldObject.setAttribute('dynamic-body', ''); // physics weer aan
            this.heldObject = null;
        }
    }
});



