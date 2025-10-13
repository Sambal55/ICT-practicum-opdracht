AFRAME.registerComponent("input-listen", {
    init: function () {
        // squeeze button in WebXR debugger
        this.el.addEventListener("triggerdown", (e) => {
            console.log("triggerdown", e.target.id);
        });

        this.el.grab = false;

        //Called when trigger is pressed
        //squeeze button in WebXR debugger
        this.el.addEventListener("triggerdown", function (e) {
            console.log("triggerdown", e.target.id);

            //Setting grab flag as true.
            this.grab = true;
        });

        //Called when trigger is release
        //squeeze button in WebXR debugger
        this.el.addEventListener("triggerup", function (e) {
            console.log("triggerup", e.target.id);

            //Setting grab flag as false.
            this.grab = false;

        });

        // veranderen naar purp if not purp already
        this.el.addEventListener("collide", (e) => {
            const hitEl = e.detail.body.el;
            if (!hitEl) return;

            if (hitEl.getAttribute("color") !== "purple") {
                console.log("collide with", hitEl.id || hitEl.className);
                hitEl.setAttribute("color", "purple");
            }
            if( this.grab === true){
                console.log("hit");
                console.log(hitEl.attributes.color);
                // maak t blokkie geel als je m oppakt
                hitEl.setAttribute('color', 'yellow')
                console.log(hitEl.attributes.color);
            }

        });
    }

});
