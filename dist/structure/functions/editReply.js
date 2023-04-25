"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editReply = void 0;
const discord_js_1 = require("discord.js");
function editReply(interaction, emoji, description) {
    interaction.editReply({
        embeds: [
            new discord_js_1.EmbedBuilder()
                .setColor(discord_js_1.Colors.Blue)
                .setDescription(`\`${emoji}\` | ${description}`)
        ]
    });
}
exports.editReply = editReply;
