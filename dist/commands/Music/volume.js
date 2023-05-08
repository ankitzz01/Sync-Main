"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const structure_1 = require("../../structure");
exports.default = new structure_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName('volume')
        .setDescription('Change the volume of the player')
        .addIntegerOption(opt => opt.setName('volume')
        .setDescription('Enter the volume to set (Ex: 80)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)),
    category: "Music",
    async execute(interaction, client) {
        if (await (0, structure_1.memberVoice)(interaction))
            return;
        if (await (0, structure_1.botVC)(interaction))
            return;
        if (await (0, structure_1.differentVoice)(interaction))
            return;
        const player = client.player.players.get(interaction.guild?.id);
        if (!player)
            return (0, structure_1.reply)(interaction, "❌", "No song player was found", true);
        const vol = interaction.options.getInteger("volume", true);
        await interaction.deferReply();
        player.setVolume(vol);
        return (0, structure_1.editReply)(interaction, "🔊", `**Volume** set to ${vol}`);
    }
});
