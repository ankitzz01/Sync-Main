const { Client, EmbedBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "invite",
    description: "Invite me to your Server",
    category: "General",

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    execute(interaction, client) {

        return interaction.reply({

            embeds: [
                new EmbedBuilder()
                    .setTitle(`${client.user.username} Invite`)
                    .setColor(client.color)
                    .setThumbnail(client.user.displayAvatarURL())
                    .setDescription(
                        `Invite Me to your Server! \n\n**[Click Here](${client.config.invite})**`)
            ],

            components: [
                new ActionRowBuilder().addComponents(

                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(`${client.config.invite}`)
                        .setLabel("Invite Me"),

                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(`${client.config.support}`)
                        .setLabel("Support Server")
                )
            ]
        })
    }
}