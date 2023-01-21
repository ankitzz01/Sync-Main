const { Client, EmbedBuilder, StringSelectMenuInteraction } = require("discord.js");
const emojis = require("../../emojis.json")

module.exports = {
    name: "interactionCreate",
    /**
     * @param {StringSelectMenuInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {

        if (!interaction.isStringSelectMenu()) return
        if (interaction.customId !== "helpMenu") return

        const selection = interaction.values[0]

        const Sub = `__Command category for ${selection} commands__`

        if (selection === "Filter") {

            const MappedData = `\`filter nightcore\`\nApplies a nightcore filter\
            \n\n\`filter vaporwave\`\nApplies a vaporwave filter\
            \n\n\`filter bassboost\`\nApplies a bassboost filter\
            \n\n\`filter pop\`\nApplies a pop filter\
            \n\n\`filter soft\`\nApplies a soft filter\
            \n\n\`filter treblebass\`\nApplies a treblebass filter\
            \n\n\`filter 8d\`\nApplies a 8D filter\
            \n\n\`filter karaoke\`\nApplies a karaoke filter\
            \n\n\`filter vibrato\`\nApplies a vibrato filter\
            \n\n\`filter tremelo\`\nApplies a tremelo filter\
            \n\n\`filter clear\`\nClears the applied filter\
            `

            var embed = new EmbedBuilder()
                .setTitle(`${selection} Commands`)
                .setDescription(`${Sub}\n\n${MappedData}`)
                .setColor(client.color)
                .setThumbnail(client.user.displayAvatarURL())
                .setFooter({ text: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
                .setTimestamp()

        } else if (selection === "home") {

            const Intro = `**Hey ${interaction.user.username}, it's me Sync Music.\nI offer non-stop playback of your favorite tunes with customizable filters to fit your taste.\nChoose me for all of your music needs.**\n\n`
            const Features = `**My Command Categories:\n\n${emojis.music} | Music Commands\n${emojis.info} | General Commands\n${emojis.filter} | Filter\n${emojis.settings} | Others\n\n**`
            const Last = `\`Choose a category from below\``
            const Promo = `\n\n**[Invite Me](${client.config.invite})  :  [Support Server](${client.config.support})  :  [Vote Me](${client.config.topgg})**`

            var embed = new EmbedBuilder()
                .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
                .setColor(client.color)
                .setDescription(`${Intro}${Features}${Last}${Promo}`)
                .setFooter({ text: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
                .setThumbnail(client.user.displayAvatarURL())

        } else {

            const Sorted = client.commands.filter(v => v.category === `${selection}`)
            const MappedData = Sorted.map(value => `\`${value.name}\`\n${value.description}`).join("\n\n")

            var embed = new EmbedBuilder()
                .setTitle(`${selection} Commands`)
                .setDescription(`${Sub}\n\n${MappedData}`)
                .setColor(client.color)
                .setThumbnail(client.user.displayAvatarURL())
                .setFooter({ text: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
                .setTimestamp()

        }

        interaction.message.edit({ embeds: [embed] })

        await interaction.deferUpdate()

    },
}