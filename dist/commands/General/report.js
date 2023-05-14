"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_js_1 = require("../../structure/index.js");
exports.default = new index_js_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName("report")
        .setDescription("Report any issues you are facing with the bot")
        .addStringOption(opt => opt.setName('description')
        .setDescription('Explain in few words about your report')
        .setRequired(true)),
    category: "General",
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });
        (0, index_js_1.editReply)(interaction, "✅", `Thanks for reporting! The report is now submitted and will review shortly.`);
        const Embed = new discord_js_1.EmbedBuilder()
            .setColor(client.data.color)
            .setTitle(`Reported by ${interaction.user.username}`)
            .addFields({ name: `Guild`, value: `${interaction.guild?.name} (${interaction.guild?.id})` }, { name: `User`, value: `${interaction.user.username} (${interaction.user.id})` })
            .setDescription(`**Report: ${interaction.options.getString('description', true)}**`)
            .setThumbnail(interaction.user.displayAvatarURL())
            .setTimestamp();
        (0, index_js_1.log)(client, Embed, client.data.devBotEnabled ? client.data.dev.log.error : client.data.prod.log.error);
    }
});
