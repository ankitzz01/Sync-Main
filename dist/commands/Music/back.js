"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_js_1 = require("../../structure/index.js");
exports.default = new index_js_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName('back')
        .setDescription('Plays the previous song'),
    category: "Music",
    async execute(interaction, client) {
        if (await (0, index_js_1.memberVoice)(interaction))
            return;
        if (await (0, index_js_1.differentVoice)(interaction))
            return;
        if (await (0, index_js_1.botVC)(interaction))
            return;
        if (await (0, index_js_1.joinable)(interaction))
            return;
        const player = client.player.players.get(interaction.guild?.id);
        if (!player)
            return interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder()
                        .setColor("DarkRed")
                        .setDescription("No song player was found")
                ], ephemeral: true
            });
        if (!player.queue.previous)
            return interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder()
                        .setColor("DarkRed")
                        .setDescription(`No previous song was found`)
                ], ephemeral: true
            });
        await interaction.deferReply();
        let res = await player.search(player.queue.previous.uri, interaction.user);
        if (player.state !== "CONNECTED")
            player.connect();
        player.queue.add(res.tracks[0]);
        player.stop();
        player.pause(false);
        if (!player.playing &&
            !player.paused &&
            player.queue.totalSize === res.tracks.length)
            await player.play();
        return interaction.editReply({
            embeds: [new discord_js_1.EmbedBuilder()
                    .setColor(client.data.color)
                    .setDescription(`⏮ | Playing the **previous** song`)
            ]
        });
    },
});
