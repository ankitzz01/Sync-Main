import { EmbedBuilder, GuildMember, SlashCommandBuilder } from "discord.js"
import { SlashCommand, botVC, memberVoice, differentVoice, msToTimestamp, reply, editReply } from "../../structure"
import { Track } from "erela.js"

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName('grab')
        .setDescription('Sends the current playing song to your DM'),
    category: "Music",
    async execute(interaction, client) {

        if (await botVC(interaction)) return
        if (await memberVoice(interaction)) return
        if (await differentVoice(interaction)) return

        const player = client.player.players.get(interaction.guild?.id as string)
        if (!player) return reply(interaction, "❌", "No song player was found", true)
        if (!(player.playing || player.paused || player.queue.current)) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("No song was found playing")
            ], ephemeral: true
        })

        await interaction.deferReply({ ephemeral: true })

        const track = player.queue.current as Track
        const link = `https://www.google.com/search?q=${encodeURIComponent(track.title)}`

        const Embed = new EmbedBuilder()
            .setColor(client.data.color)
            .setAuthor({ name: "SAVED SONG", iconURL: (track as any).requester.displayAvatarURL() as string, url: client.data.links.support })
            .setDescription(`[\`\`${track.title}\`\`](${link})`)
            .addFields(
                { name: 'Song by', value: `\`${track.author}\``, inline: true },
                { name: 'Duration', value: `\`❯ ${msToTimestamp(track.duration)}\``, inline: true },
            )
            .setImage(`${track.displayThumbnail("maxresdefault") || client.data.links.background}`)
            .setFooter({ text: `${interaction.guild?.name}`, iconURL: interaction.guild?.iconURL() as string })
            .setTimestamp()

        await (interaction.member as GuildMember).send({ embeds: [Embed] }).catch(() => {
            return editReply(interaction, "❌", "Unable to send the song. Check if you have your DMs open")
        })

        return editReply(interaction, "✅", "The Song has been sent in your DMs!")
    }
})
