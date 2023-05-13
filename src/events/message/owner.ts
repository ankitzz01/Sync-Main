import { Message, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Events } from "discord.js";
import { CustomClient, Event } from "../../structure/index.js";

export default new Event({
    name: Events.MessageCreate,
    execute(message: Message, client: CustomClient) {

        if (!message.guild || message.author.bot) return
        if (!client.data.developers.includes(message.author.id)) return
        if (!message.content.includes("!ownerpanel")) return

        const settings = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("owner-servers")
                .setLabel("Servers")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("owner-leave")
                .setLabel("Leave Guild")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("owner-eval")
                .setLabel("Eval")
                .setStyle(ButtonStyle.Primary)

        )

        const Embed = new EmbedBuilder()
            .setColor(client.data.color)
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setTimestamp()
            .setThumbnail(`${client.user?.displayAvatarURL()}`)
            .setFooter({ text: "Owner Panel" })
            .setDescription(`**Servers\nLeave Guild\nEval**`)

        return message.channel.send({ embeds: [Embed], components: [settings] })
    }
})