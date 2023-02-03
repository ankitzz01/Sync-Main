const { Client, ChatInputCommandInteraction, EmbedBuilder, ButtonBuilder, SlashCommandBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")
module.exports = {
    data: new SlashCommandBuilder()
        .setName("vote")
        .setDescription("Vote me on top.gg"),
    category: "General",

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        const topgg = client.config.topgg

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`Vote Me`)
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`Sync Music **top.gg** Vote\n\n**[Click Here](${topgg})**`)

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Vote Me")
                .setStyle(ButtonStyle.Link)
                .setURL(topgg),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL(`${client.config.support}`)
                .setLabel("Support Server")

        )

        return interaction.reply({ embeds: [Embed], components: [row] })
    }

}