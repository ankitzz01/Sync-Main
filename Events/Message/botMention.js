const { Client, Message, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, Events } = require("discord.js")
const fs = require("fs")
const emojis = require("../../emojis.json")

module.exports = {
    name: Events.MessageCreate,

    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client) {

        const { author, guild, content } = message
        const { user } = client

        if (!guild || author.bot) return
        if (content.includes("@here") || content.includes("@everyone")) return
        if (!content.includes(user.id)) return

        const Intro = `**Hey ${author.username}, it's me Sync Music.\nI offer non-stop playback of your favorite tunes with customizable filters to fit your taste.\nChoose me for all of your music needs.**\n\n`
        const Features = `**My Command Categories:\n\n${emojis.music} | Music Commands\n${emojis.info} | General Commands\n${emojis.filter} | Filter\n${emojis.playlist} | Playlist\n${emojis.settings} | Others\n\n**`
        const Last = `\`Choose a category from below\``
        const Promo = `\n\n**[Invite Me](${client.config.invite})  :  [Support Server](${client.config.support})  :  [Vote Me](${client.config.topgg})**`

        const embedMsg = new EmbedBuilder()
            .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
            .setColor(client.color)
            .setDescription(`${Intro}${Features}${Last}${Promo}`)
            .setFooter({ text: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
            .setThumbnail(client.user.displayAvatarURL())

        let helpMenu = new ActionRowBuilder().addComponents(

            new StringSelectMenuBuilder()
                .setCustomId("helpMenu")
                .setMaxValues(1)
                .setMinValues(1)
                .setPlaceholder("Browse categories")

        )

        const emojiss = {
            General: emojis.info,
            Music: emojis.music,
            Filter: emojis.filter,
            Others: emojis.settings,
            Playlist: emojis.playlist
        }

        fs.readdirSync("././Commands").forEach((command) => {
            helpMenu.components[0].addOptions({

                label: `${command}`,
                description: `Command list for ${command}`,
                value: `${command}`,
                emoji: emojiss[command]
            })

        })

        helpMenu.components[0].addOptions({

            label: "Home",
            description: "Go back to the home page",
            value: "Home",
            emoji: emojis.home,

        })

        message.reply({ embeds: [embedMsg], components: [helpMenu] })
    }
}