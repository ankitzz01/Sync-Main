const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")
const check = require("../../Functions/check")

module.exports = {

    data: new SlashCommandBuilder()
        .setName('replay')
        .setDescription('Replay the current song'),
    category: "Music",

    async execute(interaction, client) {

        const Manager = client.player
        const player = Manager.players.get(interaction.guild.id)

        if (await check.botVC(interaction)) return
        if (await check.memberVoice(interaction)) return
        if (await check.differentVoice(interaction)) return
        if (await check.joinable(interaction)) return

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

        await player.seek(0)

        player.pause(false)

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`🔁 | **Replaying** the current song`)

        return interaction.editReply({ embeds: [Embed] })
    }
}