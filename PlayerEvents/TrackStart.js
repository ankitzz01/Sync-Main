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

        const volup = "<:musicvolumeup:1026518220166922361>"
        const voldown = "<:musicvolumedown:1026518217801338900>"
        const pauseresume = "<:musicplaypause:1026518174881038437>"
        const skip = "<:musicnext:1026518134905110650>"
        const stop = "<:musicstop:1026518215557394472>"

        const settings = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("vol-down")
                .setEmoji(voldown)
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("pause-resume-song")
                .setEmoji(pauseresume)
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("stop-song")
                .setEmoji(stop)
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("skip-song")
                .setEmoji(skip)
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("vol-up")
                .setEmoji(volup)
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