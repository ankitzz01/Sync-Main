import { ButtonInteraction, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from "discord.js"
import { memberVoice, joinable, differentVoice, stageCheck, CustomClient, Event } from "../../structure/index.js"

export default new Event({
    name: Events.InteractionCreate,
    async execute(interaction: ButtonInteraction) {
        if (!interaction.isButton()) return
        if (interaction.customId !== "search-song") return

        if (await memberVoice(interaction)) return
        if (await joinable(interaction)) return
        if (await differentVoice(interaction)) return
        if (await stageCheck(interaction)) return

        const modal = new ModalBuilder()
            .setCustomId("song-req")
            .setTitle("Play a song")

        const song = new TextInputBuilder()
            .setCustomId("song-req-name")
            .setLabel("Name")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Enter the song name")
            .setRequired(true)

        const RowTop = new ActionRowBuilder<TextInputBuilder>().addComponents(song)

        modal.addComponents(RowTop)

        await interaction.showModal(modal)
    }
})