const { Client, ChatInputCommandInteraction, EmbedBuilder, AttachmentBuilder } = require("discord.js")
const db = require("../../Schema/playedDB")
const { profileImage } = require("discord-arts")

const pms = require("pretty-ms")

module.exports = {
    name: "profile",
    description: "Check your Sync profile",
    category: "Others",

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { user } = interaction

        await interaction.deferReply()

        let songplayed = Number
        let timeListened = String

        const data = await db.findOne({ User: user.id })

        if (!data) { songplayed = 0, timeListened = "0" }
        else { songplayed = data.Played, timeListened = pms(data.Time, {verbose: true}) }

        const buffer = await profileImage(user.id, {
            customTag: 'Keep Syncing',
            customBackground: './Assets/profile.png',
            overwriteBadges: true,
            borderColor: [client.color],
            presenceStatus: 'dnd'
        })

        const attachment = new AttachmentBuilder(buffer, { name: 'profile.png' })

        const Profile = new EmbedBuilder()
            .setColor(client.color)
            .setImage("attachment://profile.png")
            .setDescription(`**Songs Played - ${songplayed} | Listened for - ${timeListened}**`)

        return interaction.editReply({ embeds: [Profile], files: [attachment] })

    }
}