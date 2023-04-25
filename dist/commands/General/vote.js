"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../structure/index.js");
const discord_js_1 = require("discord.js");
exports.default = new index_js_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName("vote")
        .setDescription("Vote me on top.gg"),
    category: "General",
    async execute(interaction, client) {
        const topgg = client.data.topgg.vote;
        const Embed = new discord_js_1.EmbedBuilder()
            .setColor(client.data.color)
            .setTitle(`Vote Me`)
            .setThumbnail(`${client.user?.displayAvatarURL()}`)
            .setDescription(`Sync Music **top.gg** Vote\n\n**[Click Here](${topgg})**`);
        const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setLabel("Vote Me")
            .setStyle(discord_js_1.ButtonStyle.Link)
            .setURL(topgg), new discord_js_1.ButtonBuilder()
                .setStyle(discord_js_1.ButtonStyle.Link)
                .setURL(`${client.data.links.support}`)
                .setLabel("Support Server"));
        return interaction.reply({ embeds: [Embed], components: [row] });
    }
});
