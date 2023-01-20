const { Client, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js")
const { Player } = require("erela.js")
const buttonDB = require("../Structures/Schema/buttonRemove")

module.exports = {
    name: "socketClosed",

    /**
     * @param { Player} player
     * @param { WebSocket } payload
     * @param { Client } client
     */
    async execute(player, payload, client) {

        const volup = "<:musicvolumeup:1026518220166922361>"
        const voldown = "<:musicvolumedown:1026518217801338900>"
        const pauseresume = "<:musicplaypause:1026518174881038437>"
        const skip = "<:musicnext:1026518134905110650>"
        const stop = "<:musicstop:1026518215557394472>"

        const disable = new ActionRowBuilder().addComponents(
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
        if (!Channel) return

        const data = await buttonDB.find({ Guild: player.guild, Channel: player.textChannel })

        for (i = 0; i < data.length; i++) {
            const msg = Channel.messages.cache.get(data[i].MessageID)

            if (msg && msg.editable) await msg.edit({ components: [disable] })

            await data[i].delete()
        }

        player.destroy()

    }
}