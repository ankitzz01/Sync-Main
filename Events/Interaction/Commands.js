const { Client, CommandInteraction, InteractionType, EmbedBuilder, Events } = require("discord.js")
const { ApplicationCommand } = InteractionType
const Reply = require("../../Systems/Reply")
const { log } = require("../../Functions/log")

module.exports = {
    name: Events.InteractionCreate,

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const { user, guild, commandName, type } = interaction

        if (!guild || user.bot) return

        if (type !== ApplicationCommand) return

        const command = client.commands.get(commandName)

        if (!command) return Reply(interaction, "💢", `An error occurred!`, true) && client.commands.delete(commandName)

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