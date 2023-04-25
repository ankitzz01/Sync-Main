"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const structure_1 = require("../../structure");
exports.default = new structure_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName('queue')
        .setDescription('View the queue'),
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
        const queue = player.queue.map((t, i) => `\`${++i}.\` [\`${t.title}\`](https://google.com/search?q=${encodeURIComponent(t.title)}) | ${t.requester}`);
        const util = class Util {
            static chunk(arr, size) {
                const temp = [];
                for (let i = 0; i < arr.length; i += size) {
                    temp.push(arr.slice(i, i + size));
                }
                return temp;
            }
        };
        const chunked = util.chunk(queue, 10).map((x) => x.join("\n"));
        const queueEmbed = new discord_js_1.EmbedBuilder()
            .setColor(client.data.color)
            .setAuthor({ name: `${interaction.guild?.name}'s Queue`, iconURL: interaction.guild?.iconURL() })
            .setDescription(chunked[0])
            .setTimestamp();
        return interaction.editReply({
            embeds: [queueEmbed],
        });
    }
});
