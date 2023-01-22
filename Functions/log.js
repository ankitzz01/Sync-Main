async function log(client, embed, channelId) {

    const Embed = embed
    const ch = channelId
    const Channel = client.channels.cache.get(ch)

    if (!Channel) return

    await Channel.send({ embeds: [Embed] })
}

module.exports = { log }