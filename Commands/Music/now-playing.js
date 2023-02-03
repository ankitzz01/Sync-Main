const { EmbedBuilder, Client, ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js")
const convert = require("youtube-timestamp")
const check = require("../../Functions/check")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('now-playing')
        .setDescription('See the current playing song'),
    category: "Music",

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction, client) {

        const Manager = client.player
        const player = Manager.players.get(interaction.guild.id)

        if (await check.botVC(interaction)) return
        if (await check.memberVoice(interaction)) return
        if (await check.differentVoice(interaction)) return

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

        const track = player.queue.current

        let link = `https://www.google.com/search?q=${encodeURIComponent(track.title)}`

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: "NOW PLAYING", iconURL: track.requester.displayAvatarURL() })
            .setDescription(`[\`\`${track.title}\`\`](${link})`)
            .addFields(
                { name: 'Requested by', value: `<@${track.requester.id}>`, inline: true },
                { name: 'Song by', value: `\`${track.author}\``, inline: true },
                { name: 'Duration', value: `\`❯ ${convert(track.duration)}\``, inline: true },
            )
            .setImage(`${track.displayThumbnail("maxresdefault")}`)


        return interaction.editReply({ embeds: [Embed] })
    }
}
