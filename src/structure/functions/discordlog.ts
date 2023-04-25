import { EmbedBuilder, Client, Message, BaseGuildTextChannel } from "discord.js"
import { CustomClient } from "../classes"

export async function log(client: Client | CustomClient, embed: EmbedBuilder, channelId: string) {

    const Channel = await client.channels.fetch(channelId).catch(() => { })

    if (!Channel) return

    return await (Channel as BaseGuildTextChannel).send({ embeds: [embed] })
}