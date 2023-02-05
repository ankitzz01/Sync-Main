async function musicSetupUpdate(player, DB, Embed) {

    const data = await DB.findOne({ Guild: player.guild })
    if (!data) return

    const Channel = player.guild.channels.cache.get(data.Channel)
    if (!Channel) return

    const msg = Channel.messages.cache.get(data.Message)
    if (!msg || !msg.editable) return

    await msg.edit({
        embeds: [Embed]
    })

}

module.exports = { musicSetupUpdate }