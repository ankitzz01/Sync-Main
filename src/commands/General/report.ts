import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, BaseGuildTextChannel } from "discord.js"
import { CustomClient, editReply, SlashCommand } from "../../structure/index.js"

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName("report")
        .setDescription("Report any issues you are facing with the bot")
        .addStringOption(opt =>
            opt.setName('description')
                .setDescription('Explain in few words about your report')
                .setRequired(true)
        ),
    category: "General",
    async execute(interaction: ChatInputCommandInteraction, client: CustomClient) {

        await interaction.deferReply({ ephemeral: true })

        editReply(interaction, "✅", `Thanks for reporting! The report is now submitted and will review shortly.`)

        const channel = await client.channels.fetch(client.data.prod.log.error).catch(() => { }) as BaseGuildTextChannel
        if (!channel) return

        return (channel as BaseGuildTextChannel).send({
            embeds: [new EmbedBuilder()
                .setColor(client.data.color)
                .setTitle(`Reported by ${interaction.user.tag}`)
                .addFields(
                    { name: `Guild`, value: `${interaction.guild?.name} (${interaction.guild?.id})` },
                    { name: `User`, value: `${interaction.user.tag} (${interaction.user.id})` },
                )
                .setDescription(`**Report: ${interaction.options.getString('description')}**`)
                .setThumbnail(interaction.user.displayAvatarURL())
                .setTimestamp()
            ]
        })
    }
})