const { Client, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require("discord.js")
const { Player } = require("erela.js")
const buttonDB = require("../../Schema/buttonRemove")
const setupDB = require("../../Schema/musicChannel")
const { musicSetupUpdate } = require("../../Functions/musicSetupUpdate")
const { buttonDisable } = require("../../Functions/buttonTemplate")

module.exports = {
    name: "socketClosed",

    /**
     * @param { Player} player
     * @param { WebSocket } payload
     * @param { Client } client
     */
    async execute(player, payload, client) {

        const Channel = client.channels.cache.get(player.textChannel)
        if (!Channel) return

        const data = await buttonDB.find({ Guild: player.guild, Channel: player.textChannel })

        for (i = 0; i < data.length; i++) {
            const msg = Channel.messages.cache.get(data[i].MessageID)

            if (msg && msg.editable) await msg.edit({ components: [buttonDisable] })

            await data[i].delete()
        }

        const setupUpdateEmbed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`No song playing currently`)
            .setImage(client.config.panelImage)
            .setDescription(
                `**[Invite Me](${client.config.invite})  :  [Support Server](${client.config.support})  :  [Vote Me](${client.config.topgg})**`
            )

        await musicSetupUpdate(client, player, setupDB, setupUpdateEmbed)



        player.destroy()

    }
}