const { ButtonInteraction, Client, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js")
const check = require("../../Functions/check")

module.exports = {
    name: Events.InteractionCreate,

    /**
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (!interaction.isButton()) return
        if (interaction.customId !== "search-song") return

        if (await check.memberVoice(interaction)) return
        if (await check.joinable(interaction)) return
        if (await check.differentVoice(interaction)) return
        if (await check.stageCheck(interaction)) return

        const modal = new ModalBuilder()
            .setCustomId("song-req")
            .setTitle("Play a song")

        const song = new TextInputBuilder()
            .setCustomId("song-req-name")
            .setLabel("Name")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Enter the song name")
            .setRequired(true)

        const RowTop = new ActionRowBuilder().addComponents(song)

        modal.addComponents(RowTop)

        await interaction.showModal(modal)
    }
}