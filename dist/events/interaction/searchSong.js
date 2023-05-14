"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_js_1 = require("../../structure/index.js");
exports.default = new index_js_1.Event({
    name: discord_js_1.Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton())
            return;
        if (interaction.customId !== "search-song")
            return;
        if (await (0, index_js_1.memberVoice)(interaction))
            return;
        if (await (0, index_js_1.joinable)(interaction))
            return;
        if (await (0, index_js_1.differentVoice)(interaction))
            return;
        if (await (0, index_js_1.stageCheck)(interaction))
            return;
        const modal = new discord_js_1.ModalBuilder()
            .setCustomId("song-req")
            .setTitle("Play a song");
        const song = new discord_js_1.TextInputBuilder()
            .setCustomId("song-req-name")
            .setLabel("Name")
            .setStyle(discord_js_1.TextInputStyle.Short)
            .setPlaceholder("Enter the song name")
            .setRequired(true);
        const RowTop = new discord_js_1.ActionRowBuilder().addComponents(song);
        modal.addComponents(RowTop);
        await interaction.showModal(modal);
    }
});
