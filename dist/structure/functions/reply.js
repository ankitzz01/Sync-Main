"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reply = void 0;
const discord_js_1 = require("discord.js");
const index_js_1 = __importDefault(require("../../index.js"));
function reply(interaction, emoji, description, ephemeral = true) {
    interaction.reply({
        embeds: [
            new discord_js_1.EmbedBuilder()
                .setColor(emoji === "❌" ? discord_js_1.Colors.DarkRed : index_js_1.default.data.color)
                .setDescription(`\`${emoji}\` | ${description}`)
        ],
        ephemeral
    });
}
exports.reply = reply;
