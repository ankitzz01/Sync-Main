const { Client, CommandInteraction, InteractionType, EmbedBuilder } = require("discord.js")
const { ApplicationCommand } = InteractionType
const Reply = require("../../Systems/Reply")
const { log } = require("../../Functions/log")

module.exports = {
    name: "interactionCreate",

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const { user, guild, commandName, member, type } = interaction

        if (!guild || user.bot) return

        if (type !== ApplicationCommand) return

        const command = client.commands.get(commandName)

        if (!command) return Reply(interaction, "💢", `An error occurred!`, true) && client.commands.delete(commandName)

        if (command.UserPerms && command.UserPerms.length !== 0) if (!member.permissions.has(command.UserPerms)) return Reply(interaction, "❎", `You need \`${command.UserPerms.join(", ")}\` permission(s) to execute this command!`, true)

        if (command.BotPerms && command.BotPerms.length !== 0) if (!guild.members.me.permissions.has(command.BotPerms)) return Reply(interaction, "❎", `I need \`${command.BotPerms.join(", ")}\` permission(s) to execute this command!`, true)

        maintenance = false

        if (maintenance && user.id !== client.config.owner) return Reply(interaction, "❎", `The bot is under maintenance. Please hang tight while we push new updates!`, true)

        command.execute(interaction, client)

        const guildLogo = interaction.guild.iconURL()
        if (!interaction.guild.iconURL) guildLogo = null

        const Embed = new EmbedBuilder()
            .setColor("DarkBlue")
            .setAuthor({ name: `${interaction.guild.name}`, iconURL: guildLogo })
            .setDescription(`\`\`\`Used In: ${interaction.guild.name} (${interaction.guild.id})\
        \nCommand Used: ${interaction.commandName} (${interaction.commandId})\
        \nUsed by: ${interaction.user.tag} (${interaction.user.id})\`\`\``)

        log(client, Embed, client.config.commandLog)
    }
}