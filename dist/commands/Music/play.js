"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const structure_1 = require("../../structure");
exports.default = new structure_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song')
        .addStringOption(opt => opt.setName('query')
        .setDescription('Enter a song name to play')
        .setRequired(true)
        .setAutocomplete(true)),
    category: "Music",
    async execute(interaction, client) {
        if (await (0, structure_1.memberVoice)(interaction))
            return;
        if (await (0, structure_1.joinable)(interaction))
            return;
        if (await (0, structure_1.differentVoice)(interaction))
            return;
        if (await (0, structure_1.stageCheck)(interaction))
            return;
        await interaction.deferReply();
        const query = interaction.options.getString("query", true);
        const player = client.player.create({
            guild: interaction.guild?.id,
            voiceChannel: interaction.member?.voice?.channel?.id,
            textChannel: interaction.channel?.id,
            selfDeafen: true
        });
        (0, structure_1.playSong)(interaction, client, player, query);
    }
});
