"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = mongoose_1.default.model("buttonRemove", new mongoose_1.default.Schema({
    Guild: { type: String, required: true },
    Channel: { type: String, required: true },
    MessageID: { type: String, required: true }
}));
