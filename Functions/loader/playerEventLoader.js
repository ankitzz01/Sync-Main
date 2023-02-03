const { loadFiles } = require("./fileLoader")
const { Client } = require("discord.js")

/**
 * @param {Client} client
 */
async function loadPlayerEvents(client) {

    let Loaded = 0
    let Failed = 0

    const files = await loadFiles("PlayerEvents")

    files.forEach(file => {

        const event = require(file)
        if (!event.name) return Failed++

        client.player.on(event.name, (...args) => event.execute(...args, client))

        Loaded++

    })

    if (Loaded !== 0) console.log(`Loaded ${Loaded} Player Events`)
    if (Failed !== 0) console.log(`Failed to load ${Failed} events`)

}

module.exports = { loadPlayerEvents }