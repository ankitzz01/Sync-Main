const { Client, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js")
const { Player } = require("erela.js")
const db = require("../Structures/Schema/playedDB")
const buttonDB = require("../Structures/Schema/buttonRemove")

module.exports = {
    name: "trackEnd",

    /**
     * @param { Player } player
     * @param { Client } client
     */
    async execute(player, track, type, client) {

        const channel = client.channels.cache.get(player.textChannel)
        if (!channel) return

        const songtime = track.duration

        let data = await db.findOne({ User: track.requester.id }).catch(err => { })

        if (!data) {
            data = new db({
                User: track.requester.id,
                Played: 1,
                Time: Number(songtime)
            })

            await data.save()
        } else {
            data.Played += 1
            data.Time += Number(songtime)

            await data.save()
        }

        const volup = "<:musicvolumeup:1026518220166922361>"
        const voldown = "<:musicvolumedown:1026518217801338900>"
        const pauseresume = "<:musicplaypause:1026518174881038437>"
        const skip = "<:musicnext:1026518134905110650>"
        const stop = "<:musicstop:1026518215557394472>"

        const settings = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("vol-down")
                .setEmoji(voldown)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

            new ButtonBuilder()
                .setCustomId("pause-resume-song")
                .setEmoji(pauseresume)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

            new ButtonBuilder()
                .setCustomId("stop-song")
                .setEmoji(stop)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

            new ButtonBuilder()
                .setCustomId("skip-song")
                .setEmoji(skip)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

            new ButtonBuilder()
                .setCustomId("vol-up")
                .setEmoji(volup)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

        )

        const Channel = client.channels.cache.get(player.textChannel)
        if(!Channel) return

        const bdata = await buttonDB.find({ Guild: player.guild, Channel: player.textChannel })

        for (i = 0; i < bdata.length; i++) {
            const msg = Channel.messages.cache.get(bdata[i].MessageID)

            if (msg && msg.editable) await msg.edit({ components: [settings] })

            await bdata[i].delete()
        }

    }
}