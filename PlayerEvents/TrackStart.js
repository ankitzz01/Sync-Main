const { Client, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js")
const { Player } = require("erela.js")
const msToTimestamp = require("youtube-timestamp")
const buttonDB = require("../Structures/Schema/buttonRemove")

module.exports = {
    name: "trackStart",

    /**
     * @param { Player } player
     * @param { Client } client
     */
    async execute(player, track, type, client) {

        const Channel = client.channels.cache.get(player.textChannel)
        if (!Channel) return
        if (Channel.type !== ChannelType.GuildText) return
        if (!Channel.permissionsFor(Channel.guild.members.me).has(PermissionFlagsBits.SendMessages)) return

        const songtime = track.duration

        const settings = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("vol-down")
                .setEmoji(client.config.button.voldown)
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("pause-resume-song")
                .setEmoji(client.config.button.pauseresume)
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("stop-song")
                .setEmoji(client.config.button.stop)
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("skip-song")
                .setEmoji(client.config.button.skip)
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("vol-up")
                .setEmoji(client.config.button.volup)
                .setStyle(ButtonStyle.Secondary),

        )

        let link = `https://www.google.com/search?q=${encodeURIComponent(track.title)}`

        const Embed = new EmbedBuilder()
            .setColor("Blue")
            .setAuthor({ name: "NOW PLAYING", iconURL: track.requester.displayAvatarURL(), url: client.config.invite })
            .setDescription(`[\`\`${track.title}\`\`](${link})`)
            .addFields(
                { name: 'Requested by', value: `\`${track.requester.username}\``, inline: true },
                { name: 'Song by', value: `\`${track.author}\``, inline: true },
                { name: 'Duration', value: `\`❯ ${msToTimestamp(songtime)}\``, inline: true })

        const msg = await Channel.send({
            embeds: [Embed],
            components: [settings]
        })

        const buttonData = new buttonDB({
            Guild: player.guild,
            Channel: player.textChannel,
            MessageID: msg.id
        })

        await buttonData.save()

    }
}