"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../structure/index.js");
const discord_js_1 = require("discord.js");
exports.default = new index_js_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName("vote")
        .setDescription("Vote me on top.gg"),
    category: "General",
    execute(interaction, client) {
        return interaction.reply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor(client.data.color)
                    .setTitle(`Vote Me`)
                    .setThumbnail(`${client.user?.displayAvatarURL()}`)
                    .setDescription(`Sync Music **top.gg** Vote\n\n**[Click Here](${client.data.topgg.vote})**`)
            ],
            components: [
                new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                    .setLabel("Vote Me")
                    .setStyle(discord_js_1.ButtonStyle.Link)
                    .setURL(client.data.topgg.vote), new discord_js_1.ButtonBuilder()
                    .setStyle(discord_js_1.ButtonStyle.Link)
                    .setURL(`${client.data.links.support}`)
                    .setLabel("Support Server"))
            ]
        });
    }
});
