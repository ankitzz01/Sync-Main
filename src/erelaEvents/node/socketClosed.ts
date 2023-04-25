import { BaseGuildTextChannel, Channel, ColorResolvable, EmbedBuilder } from "discord.js";
import buttonDB, { TempButtonSchema } from "../../schemas/tempbutton.js";
import setupDB from "../../schemas/musicchannel.js"
import { CustomClient, PlayerEvent } from "../../structure/index.js"
import { Player, Payload } from "erela.js"
import { musicSetupUpdate } from "../../structure/functions/index.js"
import { buttonDisable } from "../../systems/button"

export default new PlayerEvent({
    name: "socketClosed",
    async execute(player: Player, payload: Payload, client: CustomClient) {

        if (player.textChannel === null) return

        const Channel = await client.channels.fetch(player.textChannel).catch(() => { })
        if (!Channel) return

        const data = await buttonDB.find<TempButtonSchema>({ Guild: player.guild, Channel: player.textChannel })

        for (let i = 0; i < data.length; i++) {
            const msg = await (Channel as BaseGuildTextChannel).messages.fetch(data[i].MessageID).catch(() => { })

            if (msg && msg.editable) await msg.edit({ components: [buttonDisable] })

            await data[i].delete()
        }

        const setupUpdateEmbed = new EmbedBuilder()
            .setColor(client.color as ColorResolvable)
            .setTitle(`No song playing currently`)
            .setImage(client.data.links.background)
            .setDescription(
                `**[Invite Me](${client.data.links.invite})  :  [Support Server](${client.data.links.support})  :  [Vote Me](${client.data.topgg.vote})**`
            )

        await musicSetupUpdate(client, player, setupDB, setupUpdateEmbed)

        player.destroy()

    },
})