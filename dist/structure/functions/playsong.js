"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playSong = void 0;
const discord_js_1 = require("discord.js");
const index_js_1 = require("../../structure/index.js");
async function playSong(interaction, client, player, query) {
    let res;
    if (player.state !== "CONNECTED")
        player.connect();
    try {
        res = await player.search(query, interaction.user);
        if (res.loadType === "LOAD_FAILED") {
            if (!player.queue.current)
                player.destroy();
            return interaction.editReply({
                embeds: [new discord_js_1.EmbedBuilder()
                        .setColor("DarkRed")
                        .setDescription(`An error has occured!`)
                ]
            });
        }
        else if (res.loadType === "NO_MATCHES") {
            if (!player.queue.current)
                player.destroy();
            return interaction.editReply({
                embeds: [new discord_js_1.EmbedBuilder()
                        .setColor("DarkRed")
                        .setDescription(`No result found for the query`)
                ]
            });
        }
        else if (res.loadType === "PLAYLIST_LOADED") {
            player.queue.add(res.tracks);
            if (!player.playing && !player.paused && !player.queue.size)
                await player.play();
            let link = `https://www.google.com/search?q=${encodeURIComponent(res.tracks[0].title)}`;
            return interaction.editReply({
                embeds: [new discord_js_1.EmbedBuilder()
                        .setColor(client.data.color)
                        .setAuthor({ name: "ADDED TO QUEUE", iconURL: interaction.user.displayAvatarURL(), url: client.data.links.invite })
                        .setDescription(`[\`\`${res.tracks[0].title}\`\`](${link})\n\nAdded by: ${interaction.user} | Duration: \`❯ ${(0, index_js_1.msToTimestamp)(res.tracks[0].duration)}\``)
                ]
            });
        }
        else if (["TRACK_LOADED", "SEARCH_RESULT"].includes(res.loadType)) {
            let link = `https://www.google.com/search?q=${encodeURIComponent(res.tracks[0].title)}`;
            player.queue.add(res.tracks[0]);
            if (!player.playing && !player.paused && !player.queue.size)
                await player.play();
            return interaction.editReply({
                embeds: [new discord_js_1.EmbedBuilder()
                        .setColor(client.data.color)
                        .setAuthor({ name: "ADDED TO QUEUE", iconURL: interaction.user.displayAvatarURL(), url: client.data.links.invite })
                        .setDescription(`[\`\`${res.tracks[0].title}\`\`](${link})\n\n**Added by: ${interaction.user} | Duration: **\`\`❯ ${(0, index_js_1.msToTimestamp)(res.tracks[0].duration)}\`\``)
                ]
            });
        }
    }
    catch (error) {
        interaction.editReply({
            embeds: [new discord_js_1.EmbedBuilder()
                    .setColor("DarkRed")
                    .setDescription(`An **error** has occured! Please report to us using \`/report\`.`)
            ]
        });
        return console.log(error);
    }
}
exports.playSong = playSong;
