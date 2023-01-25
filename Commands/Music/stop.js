const { Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const check = require("../../Functions/check")
const buttonDB = require("../../Structures/Schema/buttonRemove")
const emoji = require("../../emojis.json")

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

        const disable = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("vol-down")
                .setEmoji(emoji.button.voldown)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

            new ButtonBuilder()
                .setCustomId("pause-resume-song")
                .setEmoji(emoji.button.pauseresume)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

            new ButtonBuilder()
                .setCustomId("stop-song")
                .setEmoji(emoji.button.stop)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

            new ButtonBuilder()
                .setCustomId("skip-song")
                .setEmoji(emoji.button.skip)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

            new ButtonBuilder()
                .setCustomId("vol-up")
                .setEmoji(emoji.button.volup)
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