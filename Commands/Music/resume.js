const { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } = require("discord.js")
const check = require("../../Functions/check")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the current track'),
    category: "Music",
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
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
                .setColor(client.color)
                .setDescription(`▶ | **Resumed** the player`)
            ]
        })
    }

}