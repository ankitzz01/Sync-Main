const { Client, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js")
const { Player } = require("erela.js")
const msToTimestamp = require("youtube-timestamp")
const buttonDB = require("../../Schema/buttonRemove")
const wait = require("node:timers/promises").setTimeout
const emoji = require("../../emojis.json")

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
        if (!Channel.guild.members.me.permissionsIn(Channel).has(PermissionFlagsBits.SendMessages)) return

        const songtime = track.duration

        const settings = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("vol-down")
                .setEmoji(emoji.button.voldown)
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("pause-resume-song")
                .setEmoji(emoji.button.pauseresume)
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("stop-song")
                .setEmoji(emoji.button.stop)
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("skip-song")
                .setEmoji(emoji.button.skip)
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("vol-up")
                .setEmoji(emoji.button.volup)
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
        await wait(2000)

        await buttonData.save()

    }
}