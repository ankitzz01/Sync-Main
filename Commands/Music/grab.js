const { EmbedBuilder, Client, ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js")
const convert = require("youtube-timestamp")
const check = require("../../Functions/check")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('grab')
        .setDescription('Sends the current playing song to your DM'),
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

        await interaction.deferReply({ ephemeral: true })

        const track = player.queue.current

        let link = `https://www.google.com/search?q=${encodeURIComponent(track.title)}`

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: "SAVED SONG", iconURL: track.requester.displayAvatarURL(), url: client.config.support })
            .setDescription(`[\`\`${track.title}\`\`](${link})`)
            .addFields(
                { name: 'Song by', value: `\`${track.author}\``, inline: true },
                { name: 'Duration', value: `\`❯ ${convert(track.duration)}\``, inline: true },
            )
            .setImage(`${track.displayThumbnail("maxresdefault")}` || client.config.panelImage)
            .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
            .setTimestamp()

        try {
            await interaction.member.send({ embeds: [Embed] })
        } catch (error) {

            return interaction.editReply({ embeds: [new EmbedBuilder().setColor("DarkRed").setDescription("Unable to send the song. Check if you have your DM open")] })

        }

        return interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.color).setDescription("The Song has been sent in your DM!")] })
    }
}
