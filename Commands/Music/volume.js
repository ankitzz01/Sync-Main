const { Client, ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder, SlashCommandBuilder } = require("discord.js")
const check = require("../../Functions/check")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Change the volume of the player')
        .addIntegerOption(opt => {
            opt.setName('volume')
                .setDescription('Enter the volume to set (Ex: 80)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        }),
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