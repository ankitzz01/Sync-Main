"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playSong = void 0;
const discord_js_1 = require("discord.js");
const index_js_1 = require("../../structure/index.js");
async function playSong(interaction, client, player, query) {
    try {
        if (player.state !== "CONNECTED")
            player.connect();
        let res = await player.search(query, interaction.user);
        const link = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        switch (res.loadType) {
            case "LOAD_FAILED":
                {
                    if (!player.queue.current)
                        player.destroy();
                    (0, index_js_1.editReply)(interaction, "❌", "Something went wrong while playing the requested song");
                }
                break;
            case "NO_MATCHES":
                {
                    if (!player.queue.current)
                        player.destroy();
                    (0, index_js_1.editReply)(interaction, "❌", "No result found");
                }
                break;
            case "PLAYLIST_LOADED":
                {
                    player.queue.add(res.tracks);
                    if (!player.playing && !player.paused && !player.queue.size)
                        await player.play();
                    interaction.editReply({
                        embeds: [new discord_js_1.EmbedBuilder()
                                .setColor(client.data.color)
                                .setAuthor({ name: "ADDED TO QUEUE", iconURL: interaction.user.displayAvatarURL(), url: client.data.links.invite })
                                .setDescription(`[\`\`${res.tracks[0].title || query}\`\`](${link})\n\nAdded by: ${interaction.user} | Duration: \`❯ ${(0, index_js_1.msToTimestamp)(res.tracks[0].duration)}\``)]
                    });
                }
                break;
            default:
                {
                    player.queue.add(res.tracks[0]);
                    if (!player.playing && !player.paused && !player.queue.size)
                        await player.play();
                    interaction.editReply({
                        embeds: [new discord_js_1.EmbedBuilder()
                                .setColor(client.data.color)
                                .setAuthor({ name: "ADDED TO QUEUE", iconURL: interaction.user.displayAvatarURL(), url: client.data.links.invite })
                                .setDescription(`[\`\`${res.tracks[0].title}\`\`](${link})\n\n**Added by: ${interaction.user} | Duration: **\`\`❯ ${(0, index_js_1.msToTimestamp)(res.tracks[0].duration)}\`\``)
                        ]
                    });
                }
                break;
        }
    }
    catch (error) {
        (0, index_js_1.editReply)(interaction, "❌", `Something went wrong! Please report to us using \`/report\`.`);
        return console.log(error);
    }
}
exports.playSong = playSong;
