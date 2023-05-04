import { EmbedBuilder, AttachmentBuilder, SlashCommandBuilder } from "discord.js";
import db, { PlayedSchema } from "../../schemas/played";
import { profileImage } from "discord-arts";
import pms from "pretty-ms";
import { SlashCommand } from "../../structure/index.js";

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Check your Sync profile"),
    category: "Others",
    async execute(interaction, client) {

        await interaction.deferReply()
        const data = await db.findOne<PlayedSchema>({ User: interaction.user.id })

        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.data.color)
                    .setImage("attachment://profile.png")
                    .setDescription(
                        `**Songs Played - ${data ? data.Played : 0} | Listened for - ${data ? pms(data.Time, { verbose: true }) : 0}**`
                    )
            ],
            files: [
                new AttachmentBuilder(
                    await profileImage(interaction.user.id, {
                        customTag: 'Keep Syncing',
                        customBackground: './Assets/profile.png',
                        overwriteBadges: true,
                        borderColor: [client.color],
                        presenceStatus: 'dnd'
                    }),
                    { name: 'profile.png' },
                )
            ]
        })

    }
})