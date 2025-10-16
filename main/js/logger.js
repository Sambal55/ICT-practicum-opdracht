// logger.js
let debugMode = false;
let debugLines = [];

export function log(msg) {
    debugLines.push(msg);
    console.log(msg);
    if (debugLines.length > 8) debugLines.shift();

    const debugEl = document.querySelector('#debug');
    if (debugEl) {
        debugEl.setAttribute('value', debugLines.join("\n"));
    }
}

export function changeDebugMode() {
    debugMode = !debugMode;
    const debugElement = document.querySelector('#debug');
    const rig = document.querySelector('#rig')
    let rigPosition = rig.getAttribute('position')
    if (!debugMode) {
        debugElement?.setAttribute('visible', 'false');
        log("Debug mode OFF");
    } else {
        debugElement?.setAttribute('visible', 'true');
        log(JSON.stringify(rigPosition));
        log("Debug mode ON");
    }
}
