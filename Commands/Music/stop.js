const { Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const check = require("../../Functions/check")
const buttonDB = require("../../Structures/Schema/buttonRemove")

module.exports = {
    name: "stop",
    description: "Stop the current track",
    category: "Music",
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        const { guild } = interaction

        const Manager = client.player
        const player = Manager.players.get(guild.id)

        if (await check.memberVoice(interaction)) return
        if (await check.botVC(interaction)) return
        if (await check.differentVoice(interaction)) return

        if (!player) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("No song player was found")
            ], ephemeral: true
        })

        await interaction.deferReply()

        const volup = "<:musicvolumeup:1026518220166922361>"
        const voldown = "<:musicvolumedown:1026518217801338900>"
        const pauseresume = "<:musicplaypause:1026518174881038437>"
        const skip = "<:musicnext:1026518134905110650>"
        const stop = "<:musicstop:1026518215557394472>"

        const disable = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("vol-down")
                .setEmoji(voldown)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

            new ButtonBuilder()
                .setCustomId("pause-resume-song")
                .setEmoji(pauseresume)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

            new ButtonBuilder()
                .setCustomId("stop-song")
                .setEmoji(stop)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

            new ButtonBuilder()
                .setCustomId("skip-song")
                .setEmoji(skip)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

            new ButtonBuilder()
                .setCustomId("vol-up")
                .setEmoji(volup)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

        )

        const Channel = interaction.guild.channels.cache.get(player.textChannel)
        if (!Channel) return

        const data = await buttonDB.find({ Guild: player.guild, Channel: player.textChannel })

        for (i = 0; i < data.length; i++) {
            const msg = Channel.messages.cache.get(data[i].MessageID)

            if (msg && msg.editable) await msg.edit({ components: [disable] })

            await data[i].delete()
        }

        await player.disconnect()
        await player.destroy()

        return interaction.editReply({
            embeds: [new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`⏹ | **Stopped** the player`)
            ]
        })
    }

}