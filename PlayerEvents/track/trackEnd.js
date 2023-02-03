const { Client, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js")
const { Player } = require("erela.js")
const db = require("../../Schema/playedDB")
const buttonDB = require("../../Schema/buttonRemove")
const emoji = require("../../emojis.json")

module.exports = {
    name: "trackEnd",

    /**
     * @param { Player } player
     * @param { Client } client
     */
    async execute(player, track, type, client) {

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

        const Channel = client.channels.cache.get(player.textChannel)
        if (!Channel) return
        if (Channel.type !== ChannelType.GuildText) return

        const settings = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("vol-down")
                .setEmoji(emoji.button.voldown)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

            new ButtonBuilder()
                .setCustomId("pause-resume-song")
                .setEmoji(emoji.button.pauseresume)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

            new ButtonBuilder()
                .setCustomId("stop-song")
                .setEmoji(emoji.button.stop)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

            new ButtonBuilder()
                .setCustomId("skip-song")
                .setEmoji(emoji.button.skip)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

            new ButtonBuilder()
                .setCustomId("vol-up")
                .setEmoji(emoji.button.volup)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

        )

        const bdata = await buttonDB.find({ Guild: player.guild, Channel: player.textChannel })

        for (i = 0; i < bdata.length; i++) {
            const msg = Channel.messages.cache.get(bdata[i].MessageID)

            if (msg && msg.editable) await msg.edit({ components: [settings] })

            await bdata[i].delete()
        }

    }
}