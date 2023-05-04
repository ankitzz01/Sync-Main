import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand, botVC, memberVoice, differentVoice, msToTimestamp, reply } from "../../structure";
import { Track } from "erela.js";

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName('now-playing')
        .setDescription('Get the current playing song'),
    category: "Music",
    async execute(interaction, client) {

        if (await botVC(interaction)) return
        if (await memberVoice(interaction)) return
        if (await differentVoice(interaction)) return

        const player = client.player.players.get(interaction.guild?.id as string)
        if (!player) return reply(interaction, "❌", "No song player was found", true)
        if (!player.queue.current) return reply(interaction, "❌", "No song was found playing", true)

        await interaction.deferReply()

        const track = player.queue.current as Track
        const link = `https://www.google.com/search?q=${encodeURIComponent(track.title as string)}`

        const Embed = new EmbedBuilder()
            .setColor(client.data.color)
            .setAuthor({ name: "NOW PLAYING", iconURL: (track.requester as any).displayAvatarURL() })
            .setDescription(`[\`\`${track?.title}\`\`](${link})`)
            .addFields(
                { name: 'Requested by', value: `<@${(track.requester as any).id}>`, inline: true },
                { name: 'Song by', value: `\`${track.author}\``, inline: true },
                { name: 'Duration', value: `\`❯ ${msToTimestamp(track.duration as number)}\``, inline: true },
            )
            .setImage(`${track.displayThumbnail("maxresdefault") || client.data.links.background}`)

        return interaction.editReply({ embeds: [Embed] })
    }
})