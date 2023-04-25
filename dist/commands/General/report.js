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
        const channel = await client.channels.fetch(client.data.prod.log.error).catch(() => { });
        if (!channel)
            return;
        return channel.send({
            embeds: [new discord_js_1.EmbedBuilder()
                    .setColor(client.data.color)
                    .setTitle(`Reported by ${interaction.user.tag}`)
                    .addFields({ name: `Guild`, value: `${interaction.guild?.name} (${interaction.guild?.id})` }, { name: `User`, value: `${interaction.user.tag} (${interaction.user.id})` })
                    .setDescription(`**Report: ${interaction.options.getString('description')}**`)
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setTimestamp()
            ]
        });
    }
});
