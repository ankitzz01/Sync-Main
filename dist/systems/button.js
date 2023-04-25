"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.panelbutton = exports.buttonEnable = exports.buttonDisable = void 0;
const discord_js_1 = require("discord.js");
const emojis_js_1 = __importDefault(require("./emojis.js"));
const buttonDisable = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
    .setCustomId("vol-down")
    .setEmoji(emojis_js_1.default.button.voldown)
    .setStyle(discord_js_1.ButtonStyle.Secondary)
    .setDisabled(true), new discord_js_1.ButtonBuilder()
    .setCustomId("pause-resume-song")
    .setEmoji(emojis_js_1.default.button.pauseresume)
    .setStyle(discord_js_1.ButtonStyle.Secondary)
    .setDisabled(true), new discord_js_1.ButtonBuilder()
    .setCustomId("stop-song")
    .setEmoji(emojis_js_1.default.button.stop)
    .setStyle(discord_js_1.ButtonStyle.Secondary)
    .setDisabled(true), new discord_js_1.ButtonBuilder()
    .setCustomId("skip-song")
    .setEmoji(emojis_js_1.default.button.skip)
    .setStyle(discord_js_1.ButtonStyle.Secondary)
    .setDisabled(true), new discord_js_1.ButtonBuilder()
    .setCustomId("vol-up")
    .setEmoji(emojis_js_1.default.button.volup)
    .setStyle(discord_js_1.ButtonStyle.Secondary)
    .setDisabled(true));
exports.buttonDisable = buttonDisable;
const buttonEnable = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
    .setCustomId("vol-down")
    .setEmoji(emojis_js_1.default.button.voldown)
    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
    .setCustomId("pause-resume-song")
    .setEmoji(emojis_js_1.default.button.pauseresume)
    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
    .setCustomId("stop-song")
    .setEmoji(emojis_js_1.default.button.stop)
    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
    .setCustomId("skip-song")
    .setEmoji(emojis_js_1.default.button.skip)
    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
    .setCustomId("vol-up")
    .setEmoji(emojis_js_1.default.button.volup)
    .setStyle(discord_js_1.ButtonStyle.Secondary));
exports.buttonEnable = buttonEnable;
const panelbutton = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
    .setCustomId("vol-down")
    .setEmoji(emojis_js_1.default.button.voldown)
    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
    .setCustomId("pause-resume-song")
    .setEmoji(emojis_js_1.default.button.pauseresume)
    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
    .setCustomId("search-song")
    .setEmoji(emojis_js_1.default.button.play)
    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
    .setCustomId("stop-song")
    .setEmoji(emojis_js_1.default.button.stop)
    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
    .setCustomId("vol-up")
    .setEmoji(emojis_js_1.default.button.volup)
    .setStyle(discord_js_1.ButtonStyle.Secondary));
exports.panelbutton = panelbutton;
