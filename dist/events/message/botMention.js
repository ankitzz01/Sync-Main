"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const emojis_1 = __importDefault(require("../../systems/emojis"));
const index_js_1 = require("../../structure/index.js");
exports.default = new index_js_1.Event({
    name: discord_js_1.Events.MessageCreate,
    async execute(message, client) {
        if (!client.user)
            return;
        if (!message.guild || message.author.bot)
            return;
        if (message.content.includes("@here") || message.content.includes("@everyone"))
            return;
        if (!message.content.includes(client.user?.id))
            return;
        const Intro = `**Hey ${message.author.username}, it's me Sync Music.\nI offer non-stop playback of your favorite tunes with customizable filters to fit your taste.\nChoose me for all of your music needs.**\n\n`;
        const Features = `**My Command Categories:\n\n${emojis_1.default.music} | Music Commands\n${emojis_1.default.info} | General Commands\n${emojis_1.default.filter} | Filter\n${emojis_1.default.playlist} | Playlist\n${emojis_1.default.settings} | Others\n\n**`;
        const Last = `\`Choose a category from below\``;
        const Promo = `\n\n**[Invite Me](${client.data.links.invite})  :  [Support Server](${client.data.links.support})  :  [Vote Me](${client.data.topgg.vote})**`;
        const embedMsg = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: `${client.user?.username}`, iconURL: client.user?.displayAvatarURL() })
            .setColor(client.data.color)
            .setDescription(`${Intro}${Features}${Last}${Promo}`)
            .setFooter({ text: `${client.user?.username}`, iconURL: client.user?.displayAvatarURL() })
            .setThumbnail(`${client.user?.displayAvatarURL()}`);
        let helpMenu = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.StringSelectMenuBuilder()
            .setCustomId("helpMenu")
            .setMaxValues(1)
            .setMinValues(1)
            .setPlaceholder("Browse categories"));
        const emojiss = {
            General: emojis_1.default.info,
            Music: emojis_1.default.music,
            Filter: emojis_1.default.filter,
            Others: emojis_1.default.settings,
            Playlist: emojis_1.default.playlist
        };
        fs_1.default.readdirSync("././Commands").forEach((command) => {
            helpMenu.components[0].addOptions({
                label: `${command}`,
                description: `Command list for ${command}`,
                value: `${command}`,
                emoji: emojiss[command]
            });
        });
        helpMenu.components[0].addOptions({
            label: "Home",
            description: "Go back to the home page",
            value: "Home",
            emoji: emojis_1.default.home,
        });
        message.reply({ embeds: [embedMsg], components: [helpMenu] });
    }
});
