const { loadFiles } = require("./fileLoader")
const { Client } = require("discord.js")

/**
 * @param {Client} client
 */
async function loadCommands(client) {

    const { commands } = client

    commands.clear()

    let Loaded = 0
    let Failed = 0
    let CommandsArray = []

    const files = await loadFiles("Commands")

    files.forEach(file => {

        const command = require(file)
        if (!command.name) return Failed++

        commands.set(command.name, command)
        CommandsArray.push(command)

        Loaded++

    })

    if (Loaded !== 0) console.log(`Loaded ${Loaded} commands`)
    if (Failed !== 0) console.log(`Failed to load ${Failed} commands`)

    client.application.commands.set(CommandsArray)

}

module.exports = { loadCommands }