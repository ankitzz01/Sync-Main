"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./structure/index.js");
const config_js_1 = __importDefault(require("./config.js"));
const discord_js_1 = require("discord.js");
const client = new index_js_1.CustomClient({
    data: {
        ...config_js_1.default,
        devBotEnabled: true
    },
    intents: [697],
    partials: [
        discord_js_1.Partials.Message,
        discord_js_1.Partials.User,
        discord_js_1.Partials.ThreadMember,
        discord_js_1.Partials.GuildMember,
        discord_js_1.Partials.Channel
    ],
    allowedMentions: { parse: ["everyone", "roles", "users"] }
});
exports.default = client;
client.start();
