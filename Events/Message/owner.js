const { Client, Message, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")

module.exports = {
    name: "messageCreate",

    /**
     * @param {Message} message 
     * @param {Client} client
     */

    async execute(message, client) {

        const { author, guild, channel, content } = message

        if (!guild || author.bot) return
        if (message.author.id !== "911300377301880862") return
        if (content !== "!ownerpanel") return

        const settings = new ActionRowBuilder().addComponents(
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
            .setColor(client.color)
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
            .setTimestamp()
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({ text: "Owner Panel" })
            .setDescription(`**Servers\nLeave Guild\nEval**`)

        return message.channel.send({ embeds: [Embed], components: [settings] })
    }
}