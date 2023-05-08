"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_js_1 = require("../../structure/index.js");
exports.default = new index_js_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName('clearqueue')
        .setDescription('Clears the queue'),
    category: "Music",
    async execute(interaction, client) {
        if (await (0, index_js_1.memberVoice)(interaction))
            return;
        if (await (0, index_js_1.differentVoice)(interaction))
            return;
        if (await (0, index_js_1.botVC)(interaction))
            return;
        const player = client.player.players.get(interaction.guild?.id);
        if (!player)
            return (0, index_js_1.reply)(interaction, "❌", "No song player was found", true);
        await interaction.deferReply();
        player.queue.clear();
        return (0, index_js_1.editReply)(interaction, "🧹", "The queue has been **cleared**");
    }
});
