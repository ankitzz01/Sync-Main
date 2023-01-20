const { Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js")
const check = require("../../Functions/check")

module.exports = {
    name: "join",
    description: "Join your voice channel",
    category: "Music",

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        if (await check.memberVoice(interaction)) return
        if (await check.differentVoice(interaction)) return
        if (await check.joinable(interaction)) return
        
        if (interaction.guild.members.me.voice.channel == interaction.member.voice.channel) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`I am already connected`)
            ], ephemeral: true
        })

        const player = client.player.create({
            guild: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            selfDeafen: true,
        })

        await interaction.deferReply()

        await player.connect()

        return interaction.editReply({
            embeds: [new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`✅ | **Joined** <#${interaction.member.voice.channel.id}>`)
            ]
        })
    }

}