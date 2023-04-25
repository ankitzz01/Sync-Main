"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = mongoose_1.default.model("playlist", new mongoose_1.default.Schema({
    User: { type: String, required: true },
    Playlist: [{
            name: { type: String, required: true },
            songs: { type: [String], required: true },
            private: { type: Boolean, required: true },
            created: { type: Number, required: true }
        }],
}));
