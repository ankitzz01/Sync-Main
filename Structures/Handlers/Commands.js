const { Perms } = require("../Validation/Permissions")
const { Client } = require("discord.js")

/**
 * @param { Client } client
 */
module.exports = async (client, PG, Ascii) => {

    const Table = new Ascii("Commands Loaded")

    CommandsArray = []

    const CommandFiles = await PG(`${process.cwd()}/Commands/*/*.js`)

    CommandFiles.map(async (file) => {

        const command = require(file)

        if (!command.name) return Table.addRow(file.split("/")[7], "🔸 FAILED", "Missing a name")

        if (!command.context && !command.description) return Table.addRow(command.name, "🔸 FAILED", "Missing a description")

        if (command.UserPerms)
            if (command.UserPerms.every(perms => Perms.includes(perms))) command.default_member_permissions = false
            else return Table.addRow(command.name, "🔸 FAILED", "User Permission is invalid")

        client.commands.set(command.name, command)
        CommandsArray.push(command)

        await Table.addRow(command.name, "✅ Loaded")

    })

    console.log(Table.toString())

    client.on("ready", () => {

        client.application.commands.set(CommandsArray)

    })

}