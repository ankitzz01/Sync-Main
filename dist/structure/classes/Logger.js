"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const chalk_1 = __importDefault(require("chalk"));
class Logger {
    error(group, description) {
        return console.log("[ " + getDateInFormat() + " ]" + " | " + chalk_1.default.redBright("[ " + group.toUpperCase() + " ]") + " " + chalk_1.default.red(description));
    }
    debug(group, description) {
        return console.log("[ " + getDateInFormat() + " ]" + " | " + chalk_1.default.yellowBright("[ " + group.toUpperCase() + " ]") + " " + chalk_1.default.cyanBright(description));
    }
    info(group, description) {
        return console.log("[ " + getDateInFormat() + " ]" + " | " + chalk_1.default.greenBright("[ " + group.toUpperCase() + " ]") + " " + chalk_1.default.cyanBright(description));
    }
    highlight(text, type) {
        if (type === "success")
            return chalk_1.default.yellow(text);
        else
            return chalk_1.default.red(text);
    }
}
exports.Logger = Logger;
function getDateInFormat() {
    function toString(number, padLength) {
        return number.toString().padStart(padLength, "0");
    }
    const date = new Date();
    const dateTimeNow = toString(date.getFullYear(), 4)
        + "/" + toString(date.getMonth() + 1, 2)
        + "/" + toString(date.getDate(), 2)
        + " | " + toString(date.getHours(), 2)
        + ":" + toString(date.getMinutes(), 2)
        + ":" + toString(date.getSeconds(), 2);
    return dateTimeNow;
}
