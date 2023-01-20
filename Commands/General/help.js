const { ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, Client, StringSelectMenuBuilder } = require("discord.js")
const fs = require("fs")
const emojis = require("../../emojis.json")

module.exports = {
  name: "help",
  description: "Send the command list",
  category: "General",

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {

    const Intro = `**Hey ${interaction.user.username}, it's me Sync Music.\nI offer non-stop playback of your favorite tunes with customizable filters to fit your taste.\nChoose me for all of your music needs.**\n\n`
    const Features = `**My Command Categories:\n\n${emojis.music} | Music Commands\n${emojis.info} | Info Commands\n${emojis.filter} | Filter\n${emojis.settings} | Others\n\n**`
    const Last = `\`Choose a category from below\``
    const Promo = `\n\n**[Invite Me](${client.config.invite})  :  [Support Server](${client.config.support})  :  [Vote Me](${client.config.topgg})**`

    var embedMsg = new EmbedBuilder()
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
      Others: emojis.settings
    }

    fs.readdirSync("./Commands").forEach((command) => {
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
      value: "home",
      emoji: emojis.home,

    })

    interaction.reply({ embeds: [embedMsg], components: [helpMenu] })
  }
}