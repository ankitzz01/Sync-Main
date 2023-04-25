import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand, memberVoice, botVC, differentVoice } from "../../structure";

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the queue'),
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

        if (!player.queue.length) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor(client.data.color)
                .setDescription("⚠ | There is nothing in the queue")
            ], ephemeral: true
        })

        await interaction.deferReply()

        player.queue.shuffle()

        const shuffleEmbed = new EmbedBuilder()
            .setColor(client.data.color)
            .setDescription(`🔀 | **Shuffled** the queue`)

        return interaction.editReply({
            embeds: [shuffleEmbed],
        })
    },
})