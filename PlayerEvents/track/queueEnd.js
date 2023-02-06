const { Client, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js")
const { Player } = require("erela.js")
const buttonDB = require("../../Schema/buttonRemove")
const emoji = require("../../emojis.json")
const setupDB = require("../../Schema/musicChannel")
const { musicSetupUpdate } = require("../../Functions/musicSetupUpdate")
const emoji = require("../../emojis.json")

module.exports = {
  name: "queueEnd",

  /**
   * @param { Player } player
   * @param { Client } client
   */
  async execute(player, track, type, client) {

    const Channel = client.channels.cache.get(player.textChannel)
    if (!Channel) return

    const disable = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("vol-down")
        .setEmoji(emoji.button.voldown)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),

      new ButtonBuilder()
        .setCustomId("pause-resume-song")
        .setEmoji(emoji.button.pauseresume)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),

      new ButtonBuilder()
        .setCustomId("stop-song")
        .setEmoji(emoji.button.stop)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),

      new ButtonBuilder()
        .setCustomId("skip-song")
        .setEmoji(emoji.button.skip)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),

      new ButtonBuilder()
        .setCustomId("vol-up")
        .setEmoji(emoji.button.volup)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),

    )

    const data = await buttonDB.find({ Guild: player.guild, Channel: player.textChannel })

    for (i = 0; i < data.length; i++) {
      const msg = Channel.messages.cache.get(data[i].MessageID)

      if (msg && msg.editable) await msg.edit({ components: [disable] })

      await data[i].delete()
    }

    if (Channel.type !== ChannelType.GuildText) return
    if (!Channel.guild.members.me.permissionsIn(Channel).has(PermissionFlagsBits.SendMessages)) return

    const leaveEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setAuthor({ name: "Queue has ended! No more music to play...", iconURL: client.user.displayAvatarURL() })

    const settings = new ActionRowBuilder().addComponents(

      new ButtonBuilder()
        .setLabel("Invite Me")
        .setURL(client.config.invite)
        .setEmoji(emoji.link)
        .setStyle(ButtonStyle.Link),

      new ButtonBuilder()
        .setLabel("Vote Me")
        .setURL(client.config.topgg)
        .setEmoji(emoji.topgg)
        .setStyle(ButtonStyle.Link),

    )

    const cdata = await setupDB.findOne({ Guild: player.guild, Channel: player.textChannel })


    if (!cdata) await Channel.send({
      embeds: [leaveEmbed],
      components: [settings]
    })

    player.disconnect()
    player.destroy()

    const setupUpdateEmbed = new EmbedBuilder()
      .setColor(client.color)
      .setTitle(`No song playing currently`)
      .setImage(client.config.panelImage)
      .setDescription(
        `**[Invite Me](${client.config.invite})  :  [Support Server](${client.config.support})  :  [Vote Me](${client.config.topgg})**`
      )

    await musicSetupUpdate(client, player, setupDB, setupUpdateEmbed)

  }
}