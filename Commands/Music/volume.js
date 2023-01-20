const { Client, ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js")
const check = require("../../Functions/check")

module.exports = {
    name: "volume",
    description: "Change the volume of the player",
    options: [
        {
            name: "volume",
            description: "Enter the volume (Ex: 80)",
            type: ApplicationCommandOptionType.Integer,
            minValue: 1,
            maxValue: 100,
            required: true
        }
    ],
    category: "Music",
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        const { options } = interaction

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

        const vol = options.getInteger("volume")

        await interaction.deferReply()

        await player.setVolume(vol)

        return interaction.editReply({
            embeds: [new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`🔊 | **Volume** set to ${vol}`)
            ]
        })
    }

}