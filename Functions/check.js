const { EmbedBuilder } = require("discord.js")

async function joinable(interaction) {

    const { member } = interaction

    const VC = member.voice.channel

    if (!VC.joinable) return interaction.reply({
        embeds: [new EmbedBuilder()
            .setColor("DarkRed")
            .setDescription("I do not have permission to join your voice channel!")
        ], ephemeral: true
    })

    return false

}

async function memberVoice(interaction) {

    const { member } = interaction

    const VC = member.voice.channel

    if (!VC) return interaction.reply({
        embeds: [new EmbedBuilder()
            .setColor("DarkRed")
            .setDescription("You need to join a voice channel")
        ], ephemeral: true
    })

    return false

}

async function differentVoice(interaction) {

    const { guild, member } = interaction

    const VC = member.voice.channel

    if (guild.members.me.voice.channel && VC.id !== guild.members.me.voice.channelId) return interaction.reply({
        embeds: [new EmbedBuilder()
            .setColor("DarkRed")
            .setDescription(`I am already playing music in <#${guild.members.me.voice.channelId}>`)
        ], ephemeral: true
    })

    return false

}

async function botVC(interaction) {

    const { guild } = interaction

    const BotVC = guild.members.me.voice.channel
    if (!BotVC) return interaction.reply({
        embeds: [new EmbedBuilder()
            .setColor("DarkRed")
            .setDescription("I'm not connected to any voice channel")
        ], ephemeral: true
    })

    return false

}

module.exports = { joinable, memberVoice, differentVoice, botVC }