const { Client, Message, EmbedBuilder, PermissionFlagsBits } = require("discord.js")
const db = require("../../Structures/Schema/musicChannel")
const convert = require("youtube-timestamp")

module.exports = {
    name: "messageCreate",

    /**
     * @param {Message} message 
     * @param {Client} client
     */

    async execute(message, client) {

        const { author, guild, channel, content } = message

        if (!guild || author.bot) return
        const data = await db.findOne({ Guild: guild.id, Channel: channel.id }).catch(err => { })
        //console.log(data)
        if (!data) return

        const Channel = guild.channels.cache.get(data.Channel)
        if (!Channel) return

        if (!channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.SendMessages)) return

        const AuthorMember = guild.members.cache.get(author.id)

        if (!AuthorMember.voice.channel) return channel.send({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("You need to join a voice channel")
            ]
        })

        if (!AuthorMember.voice.channel.joinable) return channel.send({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("I do not have permission to join your voice channel!")
            ]
        })

        if (guild.members.me.voice.channel && AuthorMember.voice.channel.id !== guild.members.me.voice.channelId) return channel.send({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription(`I am already playing music in <#${guild.members.me.voice.channelId}>`)
            ]
        })

        const query = content

        const Erela = client.player

        let res

        const player = await Erela.create({
            guild: guild.id,
            voiceChannel: AuthorMember.voice.channel.id,
            textChannel: channel.id,
            selfDeafen: true
        })

        if (player.state !== "CONNECTED") await player.connect()

        if(message.deletable) await message.delete()

        try {

            res = await player.search(query, author)

            let link = `https://www.google.com/search?q=${encodeURIComponent(query)}`

            if (res.loadType === "LOAD_FAILED") {

                if (!player.queue.current) player.destroy()
                return channel.send({
                    embeds: [new EmbedBuilder()
                        .setColor("DarkRed")
                        .setDescription(`An error has occured!`)
                    ]
                })
            } else if (res.loadType === "NO_MATCHES") {
                if (!player.queue.current) await player.destroy()
                return channel.send({
                    embeds: [new EmbedBuilder()
                        .setColor("DarkRed")
                        .setDescription(`No result found for the query`)
                    ]
                })
            } else if (res.loadType === "PLAYLIST_LOADED") {

                player.queue.add(res.tracks)
                if (!player.playing && !player.paused && !player.queue.size) await player.play()

                return channel.send({
                    embeds: [new EmbedBuilder()
                        .setColor(client.color)
                        .setAuthor({ name: "ADDED TO QUEUE", iconURL: author.displayAvatarURL(), url: client.config.invite })
                        .setDescription(`[\`\`${res.tracks[0].title}\`\`](${link})\n\nAdded by: ${author} | Duration: \`❯ ${convert(res.tracks[0].duration)}\``)
                    ]
                })

            } else if (["TRACK_LOADED", "SEARCH_RESULT"].includes(res.loadType)) {

                player.queue.add(res.tracks[0])
                if (!player.playing && !player.paused && !player.queue.size) await player.play()

                return channel.send({
                    embeds: [new EmbedBuilder()
                        .setColor(client.color)
                        .setAuthor({ name: "ADDED TO QUEUE", iconURL: author.displayAvatarURL(), url: client.config.invite })
                        .setDescription(`[\`\`${res.tracks[0].title}\`\`](${link})\n\n**Added by: ${author} | Duration: **\`\`❯ ${convert(res.tracks[0].duration)}\`\``)
                    ]
                })
            }

        } catch (error) {
            console.log(error)
        }
    }
}