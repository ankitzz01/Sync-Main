const { EmbedBuilder, ApplicationCommandOptionType, ChatInputCommandInteraction } = require("discord.js")
const check = require("../../Functions/check")

module.exports = {

    name: 'forward',
    description: 'Skip a certain amount of seconds forward',
    category: "Music",
    options: [
        {
            name: "seconds",
            description: "Enter the amount of seconds to seek",
            type: ApplicationCommandOptionType.Integer,
            required: true
        }
    ],
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const { options } = interaction

        const Manager = client.player
        const player = Manager.players.get(interaction.guild.id)

        if (await check.botVC(interaction)) return
        if (await check.memberVoice(interaction)) return
        if (await check.differentVoice(interaction)) return

        if (!player) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("No song player was found")
            ], ephemeral: true
        })

        if(!player.playing || !player.queue.current) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("No song was found playing")
            ], ephemeral: true
        })

        await interaction.deferReply()

        const forwardAmount = options.getInteger("seconds")

        let seektime = Number(player.position) + Number(forwardAmount) * 1000

        if (Number(forwardAmount) <= 0) seektime = Number(player.position)

        if (Number(seektime) >= player.queue.current.duration) seektime = player.queue.current.duration - 1000

        player.seek(Number(seektime))

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`⏩ | Skipped **${forwardAmount}** seconds forward`)
        return interaction.editReply({ embeds: [Embed] })

    }

}