import { EmbedBuilder, SlashCommandBuilder } from "discord.js"
import { SlashCommand, botVC, memberVoice, differentVoice, msToTimestamp } from "../../structure"
import { Track } from "erela.js"

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName('now-playing')
        .setDescription('See the current playing song'),
    category: "Music",
    async execute(interaction, client) {

        const Manager = client.player
        const player = Manager.players.get(interaction.guild?.id as string)

        if (await botVC(interaction)) return
        if (await memberVoice(interaction)) return
        if (await differentVoice(interaction)) return

        if (!player) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("No song player was found")
            ], ephemeral: true
        })

        if (!(player.playing || player.paused || player.queue.current)) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("No song was found playing")
            ], ephemeral: true
        })

        await interaction.deferReply()

        const track = player.queue.current as Track

        let link = `https://www.google.com/search?q=${encodeURIComponent(track.title as string)}`

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