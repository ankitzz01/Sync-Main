import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import emoji from "./emojis.js";

const buttonDisable = new ActionRowBuilder<ButtonBuilder>().addComponents(
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

const buttonEnable = new ActionRowBuilder<ButtonBuilder>().addComponents(
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

const panelbutton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
        .setCustomId("vol-down")
        .setEmoji(emoji.button.voldown)
        .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
        .setCustomId("pause-resume-song")
        .setEmoji(emoji.button.pauseresume)
        .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
        .setCustomId("search-song")
        .setEmoji(emoji.button.play)
        .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
        .setCustomId("stop-song")
        .setEmoji(emoji.button.stop)
        .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
        .setCustomId("vol-up")
        .setEmoji(emoji.button.volup)
        .setStyle(ButtonStyle.Secondary),

)

export { buttonDisable, buttonEnable, panelbutton }