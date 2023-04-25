"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_js_1 = require("../../structure/index.js");
exports.default = new index_js_1.Event({
    name: discord_js_1.Events.InteractionCreate,
    async execute(interaction, client) {
        if (interaction.type !== discord_js_1.InteractionType.ModalSubmit)
            return;
        if (!interaction.guild || interaction.user.bot)
            return;
        if (interaction.customId !== "song-req")
            return;
        await interaction.deferReply({ ephemeral: true });
        const query = interaction.fields.getTextInputValue("song-req-name");
        if (!interaction.channel)
            return (0, index_js_1.editReply)(interaction, "❌", `An **error** has occured! Please report to us using \`/report\`.`);
        const player = client.player.create({
            guild: interaction.guild.id,
            voiceChannel: interaction.member?.voice.channel?.id,
            textChannel: interaction.channel.id,
            selfDeafen: true
        });
        (0, index_js_1.playSong)(interaction, client, player, query);
    }
});
