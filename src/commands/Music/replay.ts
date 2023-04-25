import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand, memberVoice, botVC, differentVoice, joinable, stageCheck } from "../../structure";

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName('replay')
        .setDescription('Replay the current song'),
    category: "Music",

    async execute(interaction, client) {

        const player = client.player.players.get(interaction.guild?.id as string)

        if (await botVC(interaction)) return
        if (await memberVoice(interaction)) return
        if (await differentVoice(interaction)) return
        if (await stageCheck(interaction)) return
        if (await joinable(interaction)) return

        if (!player) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("No song player was found")
            ], ephemeral: true
        })

        if (!(player.playing || !player.paused)) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("No song was found playing")
            ], ephemeral: true
        })

        await interaction.deferReply()

        player.seek(0)

        player.pause(false)

        const Embed = new EmbedBuilder()
            .setColor(client.data.color)
            .setDescription(`🔁 | **Replaying** the current song`)

        return interaction.editReply({ embeds: [Embed] })
    }
})