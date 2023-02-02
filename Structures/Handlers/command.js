const { Client } = require("discord.js")
const c = require("colors")

/**
 * @param { Client } client
 */
module.exports = async (client, PG) => {

    CommandsArray = []
    let loaded = 0

    const CommandFiles = await PG(`${process.cwd()}/Commands/*/*.js`)

    CommandFiles.map(async (file) => {

        const command = require(file)

        if (command.UserPerms) command.default_member_permissions = false

        client.commands.set(command.name, command)
        CommandsArray.push(command)

        loaded += 1

    })

    console.log(`Loaded ${loaded} commands`.green)

    client.on("ready", () => {

        client.application.commands.set(CommandsArray)

    })

}