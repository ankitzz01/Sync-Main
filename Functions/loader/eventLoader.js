const { loadFiles } = require("./fileLoader")
const { Client } = require("discord.js")

/**
 * @param {Client} client
 */
async function loadEvents(client) {

    let Loaded = 0
    let Failed = 0

    const files = await loadFiles("Events")

    files.forEach(file => {

        const event = require(file)
        if (!event.name) return Failed++

        if (event.once) client.once(event.name, (...args) => event.execute(...args, client))
        else client.on(event.name, (...args) => event.execute(...args, client))

        Loaded++

    })

    if (Loaded !== 0) console.log(`Loaded ${Loaded} Discord Events`)
    if (Failed !== 0) console.log(`Failed to load ${Failed} events`)

}

module.exports = { loadEvents }