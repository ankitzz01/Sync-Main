"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const structure_1 = require("../../structure");
exports.default = new structure_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the queue'),
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
        if (!player.queue.length)
            return interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder()
                        .setColor(client.data.color)
                        .setDescription("⚠ | There is nothing in the queue")
                ], ephemeral: true
            });
        await interaction.deferReply();
        player.queue.shuffle();
        const shuffleEmbed = new discord_js_1.EmbedBuilder()
            .setColor(client.data.color)
            .setDescription(`🔀 | **Shuffled** the queue`);
        return interaction.editReply({
            embeds: [shuffleEmbed],
        });
    },
});
