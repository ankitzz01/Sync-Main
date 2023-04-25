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
        const player = client.player.players.get(interaction.guild?.id);
        if (await (0, index_js_1.memberVoice)(interaction))
            return;
        if (await (0, index_js_1.differentVoice)(interaction))
            return;
        if (await (0, index_js_1.botVC)(interaction))
            return;
        if (!player)
            return interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder()
                        .setColor("DarkRed")
                        .setDescription("No song player was found")
                ], ephemeral: true
            });
        await interaction.deferReply();
        await player.queue.clear();
        return interaction.editReply({
            embeds: [new discord_js_1.EmbedBuilder()
                    .setColor(client.data.color)
                    .setDescription(`🧹 | The queue has been **cleared**`)
            ]
        });
    }
});
