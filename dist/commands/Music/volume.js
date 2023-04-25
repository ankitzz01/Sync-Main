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
        const player = client.player.players.get(interaction.guild?.id);
        if (await (0, structure_1.memberVoice)(interaction))
            return;
        if (await (0, structure_1.botVC)(interaction))
            return;
        if (await (0, structure_1.differentVoice)(interaction))
            return;
        if (!player)
            return interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder()
                        .setColor("DarkRed")
                        .setDescription("No song player was found")
                ], ephemeral: true
            });
        const vol = interaction.options.getInteger("volume", true);
        await interaction.deferReply();
        player.setVolume(vol);
        return interaction.editReply({
            embeds: [new discord_js_1.EmbedBuilder()
                    .setColor(client.data.color)
                    .setDescription(`🔊 | **Volume** set to ${vol}`)
            ]
        });
    }
});
