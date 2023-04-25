"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.msToTimestamp = void 0;
function msToTimestamp(duration) {
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    hours < 1 ? hours = "" : hours = hours + ":";
    if (minutes < 1)
        minutes = "00:";
    else if (minutes < 10)
        minutes = "0" + minutes + ":";
    else
        minutes = minutes + ":";
    seconds < 10 ? seconds = "0" + seconds : seconds = seconds.toString();
    return hours + minutes + seconds;
}
exports.msToTimestamp = msToTimestamp;
