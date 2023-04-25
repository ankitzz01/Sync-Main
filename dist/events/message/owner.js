"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_js_1 = require("../../structure/index.js");
exports.default = new index_js_1.Event({
    name: discord_js_1.Events.MessageCreate,
    execute(message, client) {
        if (!message.guild || message.author.bot)
            return;
        if (!client.data.developers.includes(message.author.id))
            return;
        if (!message.content.includes("!ownerpanel"))
            return;
        const settings = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId("owner-servers")
            .setLabel("Servers")
            .setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder()
            .setCustomId("owner-leave")
            .setLabel("Leave Guild")
            .setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder()
            .setCustomId("owner-eval")
            .setLabel("Eval")
            .setStyle(discord_js_1.ButtonStyle.Primary));
        const Embed = new discord_js_1.EmbedBuilder()
            .setColor(client.data.color)
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
            .setTimestamp()
            .setThumbnail(`${client.user?.displayAvatarURL()}`)
            .setFooter({ text: "Owner Panel" })
            .setDescription(`**Servers\nLeave Guild\nEval**`);
        return message.channel.send({ embeds: [Embed], components: [settings] });
    }
});
