const convert = require("youtube-timestamp")
const { EmbedBuilder } = require("discord.js")

async function playSong(interaction, client, player, query, user) {

    let res

    if (player.state !== "CONNECTED") await player.connect()

    try {

        res = await player.search(query, user)

        if (res.loadType === "LOAD_FAILED") {

            if (!player.queue.current) await player.destroy()
            return interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setColor("DarkRed")
                    .setDescription(`An error has occured!`)
                ]
            })

        } else if (res.loadType === "NO_MATCHES") {
            if (!player.queue.current) await player.destroy()
            return interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setColor("DarkRed")
                    .setDescription(`No result found for the query`)
                ]
            })
        } else if (res.loadType === "PLAYLIST_LOADED") {

            player.queue.add(res.tracks)
            if (!player.playing && !player.paused && !player.queue.size) await player.play()

            let link = `https://www.google.com/search?q=${encodeURIComponent(res.tracks[0].title)}`

            return interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: "ADDED TO QUEUE", iconURL: user.displayAvatarURL(), url: client.config.invite })
                    .setDescription(`[\`\`${res.tracks[0].title}\`\`](${link})\n\nAdded by: ${user} | Duration: \`❯ ${convert(res.tracks[0].duration)}\``)
                ]
            })

        } else if (["TRACK_LOADED", "SEARCH_RESULT"].includes(res.loadType)) {

            let link = `https://www.google.com/search?q=${encodeURIComponent(res.tracks[0].title)}`

            player.queue.add(res.tracks[0])
            if (!player.playing && !player.paused && !player.queue.size) await player.play()

            return interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: "ADDED TO QUEUE", iconURL: user.displayAvatarURL(), url: client.config.invite })
                    .setDescription(`[\`\`${res.tracks[0].title}\`\`](${link})\n\n**Added by: ${user} | Duration: **\`\`❯ ${convert(res.tracks[0].duration)}\`\``)
                ]
            })
        }

    } catch (error) {
        interaction.editReply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription(`An error has occured!`)
            ]
        })
        
        console.log(error)
    }
}

module.exports = { playSong }