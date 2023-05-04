import { Player } from "erela.js"
import { BaseGuildTextChannel, EmbedBuilder } from "discord.js"
import { CustomClient } from "../classes/index.js"

export async function musicSetupUpdate(client: CustomClient, player: Player, DB: any, Embed: EmbedBuilder) {

    const data = await DB.findOne({ Guild: player.guild })
    if (!data) return

    const Channel = await client.channels.fetch(data.Channel).catch(() => { })
    if (!Channel) return

    const msg = await (Channel as BaseGuildTextChannel).messages.fetch(data.Message).catch(() => { })

    if (!msg || !msg?.editable) return

    await msg.edit({ embeds: [Embed] }).catch(err => { })

}