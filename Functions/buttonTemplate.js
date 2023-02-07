const { ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js")
const emoji = require("../emojis.json")

const buttonDisable = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setCustomId("vol-down")
        .setEmoji(emoji.button.voldown)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),

    new ButtonBuilder()
        .setCustomId("pause-resume-song")
        .setEmoji(emoji.button.pauseresume)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),

    new ButtonBuilder()
        .setCustomId("stop-song")
        .setEmoji(emoji.button.stop)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),

    new ButtonBuilder()
        .setCustomId("skip-song")
        .setEmoji(emoji.button.skip)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),

    new ButtonBuilder()
        .setCustomId("vol-up")
        .setEmoji(emoji.button.volup)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),

)

const buttonEnable = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setCustomId("vol-down")
        .setEmoji(emoji.button.voldown)
        .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
        .setCustomId("pause-resume-song")
        .setEmoji(emoji.button.pauseresume)
        .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
        .setCustomId("stop-song")
        .setEmoji(emoji.button.stop)
        .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
        .setCustomId("skip-song")
        .setEmoji(emoji.button.skip)
        .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
        .setCustomId("vol-up")
        .setEmoji(emoji.button.volup)
        .setStyle(ButtonStyle.Secondary),

)

module.exports = { buttonDisable, buttonEnable }