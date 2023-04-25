import { ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, Channel, BaseGuildTextChannel, GuildTextBasedChannel } from "discord.js";
import { Player, Track } from "erela.js";
import buttonDB, { TempButtonSchema } from "../../schemas/tempbutton.js";
import emoji from "../../systems/emojis.js";
import setupDB, { MusicChannelSchema } from "../../schemas/musicchannel.js";
import { musicSetupUpdate, PlayerEvent, CustomClient } from "../../structure/index.js";
import { buttonDisable } from "../../systems/button.js";

export default new PlayerEvent({
  name: "queueEnd",
  async execute(player: Player, track: Track, type: any, client: CustomClient) {

    if (player.textChannel === null) return

    const Channel = await client.channels?.fetch(player.textChannel).catch(() => { })
    if (!Channel) return

    const data = await buttonDB.find<TempButtonSchema>({ Guild: player.guild, Channel: player.textChannel }).catch(err => { })
    if (!data) return

    for (let i = 0; i < data.length; i++) {
      const msg = await (Channel as BaseGuildTextChannel).messages?.fetch(data[i].MessageID).catch(() => { })

      if (msg && msg.editable) await msg.edit({ components: [buttonDisable] })

      await data[i].delete()
    }

    if (Channel.type !== ChannelType.GuildText) return
    if (!Channel.guild?.members.me?.permissionsIn(Channel).has(PermissionFlagsBits.SendMessages)) return

    const leaveEmbed = new EmbedBuilder()
      .setColor(client.data.color)
      .setAuthor({ name: "Queue has ended! No more music to play...", iconURL: client.user?.displayAvatarURL() })

    const settings = new ActionRowBuilder<ButtonBuilder>().addComponents(

      new ButtonBuilder()
        .setLabel("Invite Me")
        .setURL(client.data.links.invite)
        .setEmoji(emoji.link)
        .setStyle(ButtonStyle.Link),

      new ButtonBuilder()
        .setLabel("Vote Me")
        .setURL(client.data.links.topgg)
        .setEmoji(emoji.topgg)
        .setStyle(ButtonStyle.Link),

    )

    const cdata = await setupDB.findOne<MusicChannelSchema>({ Guild: player.guild, Channel: player.textChannel })

    if (!cdata) await Channel.send({
      embeds: [leaveEmbed],
      components: [settings]
    }).catch(() => { })

    player.disconnect()
    player.destroy()

    const setupUpdateEmbed = new EmbedBuilder()
      .setColor(client.data.color)
      .setTitle(`No song playing currently`)
      .setImage(client.data.links.background)
      .setDescription(
        `**[Invite Me](${client.data.links.invite})  :  [Support Server](${client.data.links.support})  :  [Vote Me](${client.data.links.topgg})**`
      )

    await musicSetupUpdate(client, player, setupDB, setupUpdateEmbed)

  }
})