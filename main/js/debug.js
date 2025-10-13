AFRAME.registerComponent("vr-debugger", {
    schema: {
        maxLines: { type: "int", default: 6 }
    },
    init: function () {
        this.logs = [];
        this.textEl = document.createElement("a-text");
        this.textEl.setAttribute("position", "0 0 -1.5");
        this.textEl.setAttribute("width", "2");
        this.textEl.setAttribute("color", "white");
        this.textEl.setAttribute("align", "left");
        this.textEl.setAttribute("wrap-count", "40");
        this.el.appendChild(this.textEl);
    },
    log: function (message) {
        this.logs.push(message);
        if (this.logs.length > this.data.maxLines) {
            this.logs.shift();
        }
        this.textEl.setAttribute("value", this.logs.join("\n"));
    }
});
