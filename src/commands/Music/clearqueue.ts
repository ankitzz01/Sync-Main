import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand, memberVoice, differentVoice, botVC } from "../../structure/index.js";

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName('clearqueue')
        .setDescription('Clears the queue'),
    category: "Music",

    async execute(interaction, client) {

        const player = client.player.players.get(interaction.guild?.id as string)

        if (await memberVoice(interaction)) return
        if (await differentVoice(interaction)) return
        if (await botVC(interaction)) return

        if (!player) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("No song player was found")
            ], ephemeral: true
        })

        await interaction.deferReply()

        await player.queue.clear()

        return interaction.editReply({
            embeds: [new EmbedBuilder()
                .setColor(client.data.color)
                .setDescription(`🧹 | The queue has been **cleared**`)
            ]
        })
    }
})