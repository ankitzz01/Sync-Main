const { Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require("discord.js")
const check = require("../../Functions/check")
const buttonDB = require("../../Schema/buttonRemove")
const setupDB = require("../../Schema/musicChannel")
const { musicSetupUpdate } = require("../../Functions/musicSetupUpdate")
const { buttonDisable } = require("../../Functions/buttonTemplate")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the current track'),
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

        const Channel = interaction.guild.channels.cache.get(player.textChannel)
        if (!Channel) return

        const data = await buttonDB.find({ Guild: player.guild, Channel: player.textChannel })

        for (i = 0; i < data.length; i++) {
            const msg = Channel.messages.cache.get(data[i].MessageID)

            if (msg && msg.editable) await msg.edit({ components: [buttonDisable] })

            await data[i].delete()
        }

        await player.disconnect()
        await player.destroy()

        const setupUpdateEmbed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`No song playing currently`)
            .setImage(client.config.panelImage)
            .setDescription(
                `**[Invite Me](${client.config.invite})  :  [Support Server](${client.config.support})  :  [Vote Me](${client.config.topgg})**`
            )

        await musicSetupUpdate(client, player, setupDB, setupUpdateEmbed)

        return interaction.editReply({
            embeds: [new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`⏹ | **Stopped** the player`)
            ]
        })
    }

}