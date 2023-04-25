import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand, memberVoice, botVC, differentVoice } from "../../structure";

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the current track'),
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

        if (player.playing) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription(`The player is already resumed`)
            ], ephemeral: true
        })

        await interaction.deferReply()

        await player.pause(false)

        return interaction.editReply({
            embeds: [new EmbedBuilder()
                .setColor(client.data.color)
                .setDescription(`▶ | **Resumed** the player`)
            ]
        })
    }
})