import { EmbedBuilder, AttachmentBuilder, SlashCommandBuilder } from "discord.js"
import db from "../../schemas/played"
import { profileImage } from "discord-arts"
import pms from "pretty-ms"
import { SlashCommand } from "../../structure/index.js"

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Check your Sync profile"),
    category: "Others",
    async execute(interaction, client) {

        await interaction.deferReply()

        let songplayed: number
        let timeListened: string

        const data = await db.findOne({ User: interaction.user.id })

        if (!data) { songplayed = 0, timeListened = "0" }
        else { songplayed = data.Played, timeListened = pms(data.Time, { verbose: true }) }

        const buffer = await profileImage(interaction.user.id, {
            customTag: 'Keep Syncing',
            customBackground: './Assets/profile.png',
            overwriteBadges: true,
            borderColor: [client.color],
            presenceStatus: 'dnd'
        })

        const attachment = new AttachmentBuilder(buffer, { name: 'profile.png' })

        const Profile = new EmbedBuilder()
            .setColor(client.data.color)
            .setImage("attachment://profile.png")
            .setDescription(`**Songs Played - ${songplayed} | Listened for - ${timeListened}**`)

        return interaction.editReply({ embeds: [Profile], files: [attachment] })

    }
})