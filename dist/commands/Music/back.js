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
            return (0, index_js_1.reply)(interaction, "❌", "No song player was found", true);
        if (!player.queue.previous)
            return (0, index_js_1.reply)(interaction, "❌", "No previous song was found", true);
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
        return (0, index_js_1.editReply)(interaction, "⏮", "Playing the **previous** song");
    },
});
