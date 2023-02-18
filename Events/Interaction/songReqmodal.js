const { Client, ModalSubmitInteraction, Events, InteractionType, EmbedBuilder } = require("discord.js")
const { playSong } = require('../../Functions/playSong')

module.exports = {
    name: Events.InteractionCreate,

    /**
     * @param {ModalSubmitInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        const { type, customId, guild, user, fields } = interaction

        if (type !== InteractionType.ModalSubmit) return
        if (!guild || user.bot) return

        if (customId !== "song-req") return

        await interaction.deferReply({ ephemeral: true })

        const query = fields.getTextInputValue("song-req-name")

        const player = await client.player.create({
            guild: guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            selfDeafen: true
        })

        playSong(interaction, client, player, query, user)


    }
}