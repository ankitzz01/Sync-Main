"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../structure/index.js");
const discord_js_1 = require("discord.js");
exports.default = new index_js_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName("invite")
        .setDescription("Invite me to your Server"),
    category: "General",
    execute(interaction, client) {
        return interaction.reply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setTitle(`${client.user?.username} Invite`)
                    .setColor(client.data.color)
                    .setThumbnail(`${client.user?.displayAvatarURL()}`)
                    .setDescription(`Invite Me to your Server! \n\n**[Click Here](${client.data.links.invite})**`)
            ],
            components: [
                new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                    .setStyle(discord_js_1.ButtonStyle.Link)
                    .setURL(client.data.links.invite)
                    .setLabel("Invite Me"), new discord_js_1.ButtonBuilder()
                    .setStyle(discord_js_1.ButtonStyle.Link)
                    .setURL(client.data.links.support)
                    .setLabel("Support Server"))
            ]
        });
    }
});
