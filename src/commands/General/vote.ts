import { CustomClient, SlashCommand } from "../../structure/index.js"
import { ChatInputCommandInteraction, EmbedBuilder, ButtonBuilder, SlashCommandBuilder, ButtonStyle, ActionRowBuilder } from "discord.js"

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName("vote")
        .setDescription("Vote me on top.gg"),
    category: "General",
    async execute(interaction: ChatInputCommandInteraction, client: CustomClient) {

        const topgg = client.data.links.topgg

        const Embed = new EmbedBuilder()
            .setColor(client.data.color)
            .setTitle(`Vote Me`)
            .setThumbnail(`${client.user?.displayAvatarURL()}`)
            .setDescription(`Sync Music **top.gg** Vote\n\n**[Click Here](${topgg})**`)

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel("Vote Me")
                .setStyle(ButtonStyle.Link)
                .setURL(topgg),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL(`${client.data.links.support}`)
                .setLabel("Support Server")

        )

        return interaction.reply({ embeds: [Embed], components: [row] })
    }
})