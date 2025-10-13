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
    const forwardVideo = document.querySelector('#timeStamp');
    const reverseVideo = document.querySelector('#reverseTimeStamp');

    if (!debugMode) {
        debugElement?.setAttribute('visible', 'false');
        forwardVideo?.setAttribute('visible', 'false');
        reverseVideo?.setAttribute('visible', 'false');
        log("Debug mode OFF");
    } else {
        debugElement?.setAttribute('visible', 'true');
        forwardVideo?.setAttribute('visible', 'true');
        reverseVideo?.setAttribute('visible', 'true');
        log("Debug mode ON");
    }
}
