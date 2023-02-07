const { ButtonInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const check = require("../../Functions/check")
const wait = require("node:timers/promises").setTimeout
const buttonDB = require("../../Schema/buttonRemove")
const setupDB = require("../../Schema/musicChannel")
const { musicSetupUpdate } = require("../../Functions/musicSetupUpdate")
const { buttonDisable } = require("../../Functions/buttonDisable")

module.exports = {
    name: "interactionCreate",

    /**
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (!interaction.isButton()) return
        if (!["vol-up", "vol-down", "pause-resume-song", "skip-song", "stop-song"].includes(interaction.customId)) return

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

        switch (interaction.customId) {

            case "vol-up": {

                const vol = player.volume + 10

                if (vol > 100) return interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`The volume can't be increased further!`)
                    ], ephemeral: true
                })

                await interaction.deferReply()

                await player.setVolume(vol)

                interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`🔊 | The volume has been set to **${player.volume}**`)
                    ]
                })

                await wait(1000)
                interaction.deleteReply()

            }
                break;

            case "vol-down": {

                const vol = player.volume - 10

                if (vol < 0) return interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`The volume can't be decreased further!`)
                    ], ephemeral: true
                })

                await interaction.deferReply()

                await player.setVolume(vol)

                interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`🔉 | The volume has been set to **${player.volume}**`)
                    ]
                })

                await wait(1000)
                interaction.deleteReply()

            }
                break;

            case "pause-resume-song": {

                await interaction.deferReply()

                if (player.paused) {
                    await player.pause(false)

                    interaction.editReply({
                        embeds: [new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`▶ | The player has been **resumed**`)
                        ]
                    })

                    await wait(1000)
                    interaction.deleteReply()

                } else {
                    await player.pause(true)

                    interaction.editReply({
                        embeds: [new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`⏸ | The player has been **paused**`)
                        ]
                    })

                    await wait(1000)
                    interaction.deleteReply()

                }

            }
                break;
            case "skip-song": {

                await interaction.deferReply()

                await player.stop()

                interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`⏭ | The current track has been **skipped**`)
                    ]
                })

                await wait(1000)
                interaction.deleteReply()

            }
                break;
            case "stop-song": {

                await interaction.deferReply()

                const data = await buttonDB.find({ Guild: player.guild, Channel: player.textChannel }).catch(err => { })

                const Channel = client.channels.cache.get(player.textChannel)

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

                interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`⏹ | The player has been **stopped**`)
                    ]
                })

                await wait(1000)
                interaction.deleteReply()

            }
                break;
        }
    },
}