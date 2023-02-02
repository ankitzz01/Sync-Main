const { Client } = require("discord.js")
const c = require("colors")

/**
 * @param {Client} client
 */
module.exports = async (client, PG) => {

    let loaded = 0

    const EventFiles = await PG(`${process.cwd()}/Events/*/*.js`)

    EventFiles.map(async file => {

        const event = require(file)

        if (event.once) client.once(event.name, (...args) => event.execute(...args, client))
        else client.on(event.name, (...args) => event.execute(...args, client))

        loaded += 1

    })

    console.log(`Loaded ${loaded} discord events`.green)

}