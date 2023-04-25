import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand, memberVoice, botVC, differentVoice } from "../../structure";

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the current track'),
    category: "Music",
    async execute(interaction, client) {

        const Manager = client.player
        const player = Manager.players.get(interaction.guild?.id as string)

        if (await memberVoice(interaction)) return
        if (await botVC(interaction)) return
        if (await differentVoice(interaction)) return

        if (!player) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("No song player was found")
            ], ephemeral: true
        })

        if (player.paused) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription(`The player is already paused`)
            ], ephemeral: true
        })

        await interaction.deferReply()

        await player.pause(true)

        return interaction.editReply({
            embeds: [new EmbedBuilder()
                .setColor(client.data.color)
                .setDescription(`⏸ | **Paused** the player`)
            ]
        })
    }
})