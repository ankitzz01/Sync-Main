const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bug")
        .setDescription("Report any bug you are facing with the bot")
        .addStringOption(opt =>
            opt.setName('description')
                .setDescription('Explain in few words about the bug')
                .setRequired(true)
        ),
    category: "General",

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const bug = interaction.options.getString('description')

        EditReply(interaction, "✅", `Thanks for reporting! The report is now submitted and will review shortly.`)

        const channel = client.channels.cache.get(client.config.errorLog)
        if (!channel) return

        return channel.send({
            embeds: [new EmbedBuilder()
                .setColor(client.color)
                .setTitle(`Bug Reported by ${interaction.user.tag}`)
                .addFields(
                    { name: `Guild`, value: `${interaction.guild.name} (${interaction.guild.id})` },
                    { name: `User`, value: `${interaction.user.tag} (${interaction.user.id})` },
                )
                .setDescription(`**Bug: ${bug}**`)
                .setThumbnail(interaction.user.displayAvatarURL())
                .setTimestamp()
            ]
        })
    }
}