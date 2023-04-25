import { BaseGuildTextChannel, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand, memberVoice, botVC, differentVoice, musicSetupUpdate } from "../../structure";
import buttonDB, { TempButtonSchema } from "../../schemas/tempbutton";
import setupDB from "../../schemas/musicchannel";
import { buttonDisable } from "../../systems/button";

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the current track'),
    category: "Music",
    async execute(interaction, client) {

        const player = client.player.players.get(interaction.guild?.id as string)

        if (await memberVoice(interaction)) return
        if (await botVC(interaction)) return
        if (await differentVoice(interaction)) return

        if (!player) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("No song player was found")
            ], ephemeral: true
        })

        await interaction.deferReply()

        const Channel = interaction.guild?.channels.cache.get(player.textChannel as string) as BaseGuildTextChannel
        if (!Channel) return

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

        return interaction.editReply({
            embeds: [new EmbedBuilder()
                .setColor(client.data.color)
                .setDescription(`⏹ | **Stopped** the player`)
            ]
        })
    }
})