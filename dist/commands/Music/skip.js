"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const structure_1 = require("../../structure");
exports.default = new structure_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current track'),
    category: "Music",
    async execute(interaction, client) {
        const Manager = client.player;
        const player = Manager.players.get(interaction.guild?.id);
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
        await interaction.deferReply();
        await player.stop();
        return interaction.editReply({
            embeds: [new discord_js_1.EmbedBuilder()
                    .setColor(client.data.color)
                    .setDescription(`⏭ | **Skipped** the song`)
            ]
        });
    }
});
