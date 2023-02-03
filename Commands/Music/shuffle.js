const { EmbedBuilder, Client, ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js")
const check = require("../../Functions/check")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the queue'),
    category: "Music",

    /**
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */

    async execute(interaction, client) {

        const Manager = client.player
        const player = Manager.players.get(interaction.guild.id)

        if (await check.memberVoice(interaction)) return
        if (await check.botVC(interaction)) return
        if (await check.differentVoice(interaction)) return

        if (!player) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("No song player was found")
            ], ephemeral: true
        })

        if (!player.queue.length) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor(client.color)
                .setDescription("⚠ | There is nothing in the queue")
            ], ephemeral: true
        })

        await interaction.deferReply()

        player.queue.shuffle()

        const shuffleEmbed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`🔀 | **Shuffled** the queue`)

        return interaction.editReply({
            embeds: [shuffleEmbed],
        })
    },
}