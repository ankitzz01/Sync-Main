import { CustomClient, SlashCommand } from "../../structure/index.js";
import { EmbedBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from "discord.js";

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Invite me to your Server"),
    category: "General",

    execute(interaction: ChatInputCommandInteraction, client: CustomClient) {

        return interaction.reply({

            embeds: [
                new EmbedBuilder()
                    .setTitle(`${client.user?.username} Invite`)
                    .setColor(client.data.color)
                    .setThumbnail(`${client.user?.displayAvatarURL()}`)
                    .setDescription(
                        `Invite Me to your Server! \n\n**[Click Here](${client.data.links.invite})**`)
            ],

            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(

                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(`${client.data.links.invite}`)
                        .setLabel("Invite Me"),

                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(`${client.data.links.support}`)
                        .setLabel("Support Server")
                )
            ]
        })
    }
})