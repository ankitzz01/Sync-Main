const { Client, ChannelType } = require("discord.js")
const { Player } = require('erela.js')

/**
 * @param {Client} client 
 * @param {Player} player 
 */

async function musicSetupUpdate(client, player, DB, Embed) {

    const data = await DB.findOne({ Guild: player.guild })
    if (!data) return

    const Channel = client.channels.cache.get(data.Channel)
    if (!Channel) return
    if (Channel.type !== ChannelType.GuildText) return

    const msg = await Channel.messages.fetch(data.Message)
    
    if (!msg) return
    if (!msg.editable) return

    await msg.edit({
        embeds: [Embed]
    })

}

module.exports = { musicSetupUpdate }