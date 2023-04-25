"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const getAllFiles = (directory) => {
    const fileArray = [];
    const files = fs_1.default.readdirSync(directory);
    for (const file of files) {
        if (fs_1.default.statSync(`${directory}/${file}`).isDirectory())
            fileArray.push(...(0, exports.getAllFiles)(`${directory}/${file}`));
        else
            fileArray.push(`${process.cwd().replace(/\\/g, "/")}/${directory.slice(2)}/${file}`);
    }
    return fileArray;
};
exports.getAllFiles = getAllFiles;
