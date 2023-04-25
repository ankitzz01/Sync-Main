"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../structure/index.js");
const discord_js_1 = require("discord.js");
const structure_1 = require("../../structure");
exports.default = new index_js_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName("ping")
        .setDescription("Shows my ping"),
    category: "General",
    voteOnly: true,
    async execute(interaction, client) {
        return (0, structure_1.reply)(interaction, "⌛", `Ping: **${client.ws.ping}** ms`, true);
    }
});
