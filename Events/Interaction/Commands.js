const { Client, CommandInteraction, InteractionType, EmbedBuilder } = require("discord.js")
const { ApplicationCommand } = InteractionType
const Reply = require("../../Systems/Reply")

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

        command.execute(interaction, client)

        const channel = client.channels.cache.get(client.config.commandLog)
        if (!channel) return

        const guildLogo = interaction.guild.iconURL()
        if (!interaction.guild.iconURL) guildLogo = 'https://png.pngtree.com/png-clipart/20200701/original/pngtree-red-error-icon-png-image_5418881.jpg'

        const Embed = new EmbedBuilder()
            .setColor("DarkBlue")
            .setAuthor({ name: `${interaction.guild.name}`, iconURL: guildLogo })
            .setDescription(`\`\`\`Used In: ${interaction.guild.name} (${interaction.guild.id})\
        \nCommand Used: ${interaction.commandName} (${interaction.commandId})\
        \nUsed by: ${interaction.user.tag} (${interaction.user.id})\`\`\``)

        channel.send({ embeds: [Embed] })
    }
}