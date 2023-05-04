import { BaseGuildTextChannel, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand, memberVoice, botVC, differentVoice, musicSetupUpdate, reply, editReply } from "../../structure";
import buttonDB, { TempButtonSchema } from "../../schemas/tempbutton";
import setupDB from "../../schemas/musicchannel";
import { buttonDisable } from "../../systems/button";

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the current track'),
    category: "Music",
    async execute(interaction, client) {

        if (await memberVoice(interaction)) return
        if (await botVC(interaction)) return
        if (await differentVoice(interaction)) return

        const player = client.player.players.get(interaction.guild?.id as string)
        if (!player) return reply(interaction, "❌", "No song player was found", true)

        await interaction.deferReply()

        const Channel = await interaction.guild?.channels.fetch(player.textChannel as string) as BaseGuildTextChannel
        if (!Channel) return reply(interaction, "❌", "Failed to stop the track", true)

        const data = await buttonDB.find<TempButtonSchema>({ Guild: player.guild, Channel: player.textChannel })

        for (let i = 0; i < data.length; i++) {
            const msg = Channel.messages.cache.get(data[i].MessageID)

            if (msg && msg.editable) await msg.edit({ components: [buttonDisable] })

            await data[i].delete()
        }

        player.disconnect()
        player.destroy()

        const setupUpdateEmbed = new EmbedBuilder()
            .setColor(client.data.color)
            .setTitle(`No song playing currently`)
            .setImage(client.data.links.background)
            .setDescription(
                `**[Invite Me](${client.data.links.invite})  :  [Support Server](${client.data.links.support})  :  [Vote Me](${client.data.topgg.vote})**`
            )
        await musicSetupUpdate(client, player, setupDB, setupUpdateEmbed)

        return editReply(interaction, "⏹", "**Stopped** the player")
    }
})