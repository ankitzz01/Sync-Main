const { Client, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js")
const { Player } = require("erela.js")
const buttonDB = require("../../Schema/buttonRemove")
const emoji = require("../../emojis.json")

module.exports = {
    name: "socketClosed",

    /**
     * @param { Player} player
     * @param { WebSocket } payload
     * @param { Client } client
     */
    async execute(player, payload, client) {

        const disable = new ActionRowBuilder().addComponents(
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