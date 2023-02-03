const { Client, Message, EmbedBuilder, PermissionFlagsBits, ChannelType } = require("discord.js")
const db = require("../../Schema/musicChannel")
const convert = require("youtube-timestamp")
const { log } = require("../../Functions/log")

module.exports = {
    name: "messageCreate",

    /**
     * @param {Message} message 
     * @param {Client} client
     */

    async execute(message, client) {

        const { author, guild, channel, content, member } = message

        if (!guild || author.bot) return
        const data = await db.findOne({ Guild: guild.id, Channel: channel.id }).catch(err => { })
        //console.log(data)
        if (!data) return

        const Channel = guild.channels.cache.get(data.Channel)
        if (!Channel) return

        if (!channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.SendMessages)) return

        if (!member.voice.channel) return channel.send({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("You need to join a voice channel")
            ]
        })

        if (!member.voice.channel.joinable) return channel.send({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("I do not have permission to join your voice channel!")
            ]
        })

        if (member.voice.channel.type == ChannelType.GuildStageVoice) return channel.send({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("Playing on Stage isn't supported yet")
            ]
        })

        if (guild.members.me.voice.channel && member.voice.channel.id !== guild.members.me.voice.channelId) return channel.send({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription(`I am already playing music in <#${guild.members.me.voice.channelId}>`)
            ]
        })

        const query = content
        let res

        const player = await client.player.create({
            guild: guild.id,
            voiceChannel: member.voice.channel.id,
            textChannel: channel.id,
            selfDeafen: true
        })

        const Embed = new EmbedBuilder()
            .setColor("DarkBlue")
            .setAuthor({ name: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL() : null })
            .setDescription(`\`\`\`Song Reqested in: ${message.guild.name}\
            \nChannel: ${message.channel.name}\
            \nAuthor: ${message.author.username}\`\`\``)

        if (player.state !== "CONNECTED") await player.connect()

        if (message.deletable) await message.delete()

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

                channel.send({
                    embeds: [new EmbedBuilder()
                        .setColor(client.color)
                        .setAuthor({ name: "ADDED TO QUEUE", iconURL: author.displayAvatarURL(), url: client.config.invite })
                        .setDescription(`[\`\`${res.tracks[0].title}\`\`](${link})\n\nAdded by: ${author} | Duration: \`❯ ${convert(res.tracks[0].duration)}\``)
                    ]
                })

                return log(client, Embed, client.config.commandLog)


            } else if (["TRACK_LOADED", "SEARCH_RESULT"].includes(res.loadType)) {

                player.queue.add(res.tracks[0])
                if (!player.playing && !player.paused && !player.queue.size) await player.play()

                channel.send({
                    embeds: [new EmbedBuilder()
                        .setColor(client.color)
                        .setAuthor({ name: "ADDED TO QUEUE", iconURL: author.displayAvatarURL(), url: client.config.invite })
                        .setDescription(`[\`\`${res.tracks[0].title}\`\`](${link})\n\n**Added by: ${author} | Duration: **\`\`❯ ${convert(res.tracks[0].duration)}\`\``)
                    ]
                })

                return log(client, Embed, client.config.commandLog)

            }

        } catch (error) {
            console.log(error)
        }
    }
}