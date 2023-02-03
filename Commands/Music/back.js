const { EmbedBuilder, Client, ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js");
const check = require("../../Functions/check");

module.exports = {

    data: new SlashCommandBuilder()
        .setName('back')
        .setDescription('Plays the previous song'),
    category: "Music",

    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {

        if (await check.memberVoice(interaction)) return
        if (await check.differentVoice(interaction)) return
        if (await check.botVC(interaction)) return
        if (await check.joinable(interaction)) return

        const Manager = client.player
        const player = Manager.players.get(interaction.guild.id)

        if (!player) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("No song player was found")
            ], ephemeral: true
        })

        if (!player.queue.previous) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription(`No previous song was found`)
            ], ephemeral: true
        })

        await interaction.deferReply()

        res = await player.search(player.queue.previous.uri, interaction.user)

        if (player.state !== "CONNECTED") await player.connect()

        player.queue.add(res.tracks[0])
        await player.stop()
        player.pause(false)
        if (
            !player.playing &&
            !player.paused &&
            player.queue.totalSize === res.tracks.length
        )
            await player.play()

        return interaction.editReply({
            embeds: [new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`⏮ | Playing the **previous** song`)
            ]
        })
    },
}