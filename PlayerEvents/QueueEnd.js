const { Client, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js")
const { Player } = require("erela.js")
const buttonDB = require("../Structures/Schema/buttonRemove")

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
        .setEmoji(client.config.button.voldown)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),

      new ButtonBuilder()
        .setCustomId("pause-resume-song")
        .setEmoji(client.config.button.pauseresume)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),

      new ButtonBuilder()
        .setCustomId("stop-song")
        .setEmoji(client.config.button.stop)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),

      new ButtonBuilder()
        .setCustomId("skip-song")
        .setEmoji(client.config.button.skip)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),

      new ButtonBuilder()
        .setCustomId("vol-up")
        .setEmoji(client.config.button.volup)
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
        .setStyle(ButtonStyle.Link),

      new ButtonBuilder()
        .setLabel("Vote Me")
        .setURL(client.config.topgg)
        .setStyle(ButtonStyle.Link),

    )

    await Channel.send({
      embeds: [leaveEmbed],
      components: [settings]
    })

    player.disconnect()

  }
}