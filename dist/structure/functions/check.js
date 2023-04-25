"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stageCheck = exports.botVC = exports.differentVoice = exports.memberVoice = exports.joinable = void 0;
const discord_js_1 = require("discord.js");
async function joinable(interaction) {
    if (!interaction.member.voice.channel?.joinable)
        return interaction.reply({
            embeds: [new discord_js_1.EmbedBuilder()
                    .setColor("DarkRed")
                    .setDescription("I do not have permission to join your voice channel!")
            ], ephemeral: true
        });
    else
        return false;
}
exports.joinable = joinable;
async function memberVoice(interaction) {
    if (!interaction.member?.voice.channel)
        return interaction.reply({
            embeds: [new discord_js_1.EmbedBuilder()
                    .setColor("DarkRed")
                    .setDescription("You need to join a voice channel")
            ], ephemeral: true
        });
    else
        return false;
}
exports.memberVoice = memberVoice;
async function differentVoice(interaction) {
    if (interaction.guild?.members.me?.voice.channel && interaction.member?.voice.channel?.id !== interaction.guild.members.me.voice.channelId)
        return interaction.reply({
            embeds: [new discord_js_1.EmbedBuilder()
                    .setColor("DarkRed")
                    .setDescription(`I am already playing music in <#${interaction.guild.members.me.voice.channelId}>`)
            ], ephemeral: true
        });
    else
        return false;
}
exports.differentVoice = differentVoice;
async function botVC(interaction) {
    if (!interaction.guild?.members.me?.voice.channel)
        return interaction.reply({
            embeds: [new discord_js_1.EmbedBuilder()
                    .setColor("DarkRed")
                    .setDescription("I'm not connected to any voice channel")
            ], ephemeral: true
        });
    else
        return false;
}
exports.botVC = botVC;
async function stageCheck(interaction) {
    if (interaction.member?.voice.channel?.type == discord_js_1.ChannelType.GuildStageVoice)
        return interaction.reply({
            embeds: [new discord_js_1.EmbedBuilder()
                    .setColor("DarkRed")
                    .setDescription("Playing on Stage isn't supported yet")
            ], ephemeral: true
        });
    else
        return false;
}
exports.stageCheck = stageCheck;
