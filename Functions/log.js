async function log(client, embed, channelId) {

    const Embed = embed
    const Channel = client.channels.cache.get(channelId)

    if (!Channel) return

    await Channel.send({ embeds: [Embed] })
}

module.exports = { log }