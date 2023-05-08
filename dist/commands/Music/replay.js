"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const structure_1 = require("../../structure");
exports.default = new structure_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName('replay')
        .setDescription('Replay the current song'),
    category: "Music",
    async execute(interaction, client) {
        if (await (0, structure_1.botVC)(interaction))
            return;
        if (await (0, structure_1.memberVoice)(interaction))
            return;
        if (await (0, structure_1.differentVoice)(interaction))
            return;
        if (await (0, structure_1.stageCheck)(interaction))
            return;
        if (await (0, structure_1.joinable)(interaction))
            return;
        const player = client.player.players.get(interaction.guild?.id);
        if (!player)
            return (0, structure_1.reply)(interaction, "❌", "No song player was found", true);
        if (!player.playing || !player.paused)
            return (0, structure_1.reply)(interaction, "❌", "No song was found playing", true);
        await interaction.deferReply();
        player.seek(0);
        player.pause(false);
        return (0, structure_1.editReply)(interaction, "🔁", "**Replaying** the current song");
    }
});
