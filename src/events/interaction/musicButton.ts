import { BaseGuildTextChannel, ButtonInteraction, EmbedBuilder, Events } from "discord.js"
import { Event, CustomClient } from "../../structure/index.js"
import { memberVoice, botVC, differentVoice } from "../../structure/functions/check.js"
import wait from "node:timers/promises"
import buttonDB, { TempButtonSchema } from "../../schemas/tempbutton.js"
import setupDB from "../../schemas/musicchannel.js"
import { musicSetupUpdate } from "../../structure/index.js"
import { buttonDisable } from "../../systems/button.js"

export default new Event({
    name: Events.InteractionCreate,

    async execute(interaction: ButtonInteraction, client: CustomClient): Promise<any> {

        if (!interaction.isButton()) return
        if (!["vol-up", "vol-down", "pause-resume-song", "skip-song", "stop-song"].includes(interaction.customId)) return

        if (!interaction.guild) return
        const player = client.player.players.get(interaction.guild?.id)

        if (await memberVoice(interaction)) return
        if (await botVC(interaction)) return
        if (await differentVoice(interaction)) return

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
                        .setColor(client.data.color)
                        .setDescription(`The volume can't be increased further!`)
                    ], ephemeral: true
                })

                await interaction.deferReply()

                player.setVolume(vol)

                interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setColor(client.data.color)
                        .setDescription(`🔊 | The volume has been set to **${player.volume}**`)
                    ]
                })

                await wait.setTimeout(1000)
                interaction.deleteReply()

            }
                break;
            case "vol-down": {

                const vol = player.volume - 10

                if (vol < 0) return interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(client.data.color)
                        .setDescription(`The volume can't be decreased further!`)
                    ], ephemeral: true
                })

                await interaction.deferReply()

                player.setVolume(vol)

                interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setColor(client.data.color)
                        .setDescription(`🔉 | The volume has been set to **${player.volume}**`)
                    ]
                })

                await wait.setTimeout(1000)
                interaction.deleteReply()

            }
                break;
            case "pause-resume-song": {

                await interaction.deferReply()

                if (player.paused) {
                    player.pause(false)

                    interaction.editReply({
                        embeds: [new EmbedBuilder()
                            .setColor(client.data.color)
                            .setDescription(`▶ | The player has been **resumed**`)
                        ]
                    })

                    await wait.setTimeout(1000)
                    interaction.deleteReply()

                } else {
                    player.pause(true)

                    interaction.editReply({
                        embeds: [new EmbedBuilder()
                            .setColor(client.data.color)
                            .setDescription(`⏸ | The player has been **paused**`)
                        ]
                    })

                    await wait.setTimeout(1000)
                    interaction.deleteReply()

                }

            }
                break;
            case "skip-song": {

                await interaction.deferReply()

                player.stop()

                interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setColor(client.data.color)
                        .setDescription(`⏭ | The current track has been **skipped**`)
                    ]
                })

                await wait.setTimeout(1000)
                interaction.deleteReply()

            }
                break;
            case "stop-song": {

                await interaction.deferReply()

                const data: any = await buttonDB.find<TempButtonSchema>({ Guild: player.guild, Channel: player.textChannel }).catch(err => { })

                if (!player.textChannel) return

                const Channel = await client.channels.fetch(player.textChannel).catch(() => { })

                for (let i = 0; i < data.length; i++) {
                    const msg = await (Channel as BaseGuildTextChannel).messages.fetch(data[i].MessageID).catch(() => { })

                    if (msg && msg.editable) await msg.edit({ components: [buttonDisable] })

                    await data[i].delete()
                }

                player.disconnect()
                player.destroy()

                const setupUpdateEmbed = new EmbedBuilder()
                    .setColor(client.data.color)
                    .setTitle(`No song playing currently`)
                    .setImage(client.data.links.background)
                    .setDescription(
                        `**[Invite Me](${client.data.links.invite})  :  [Support Server](${client.data.links.support})  :  [Vote Me](${client.data.links.topgg})**`
                    )

                await musicSetupUpdate(client, player, setupDB, setupUpdateEmbed)

                interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setColor(client.data.color)
                        .setDescription(`⏹ | The player has been **stopped**`)
                    ]
                })

                await wait.setTimeout(1000)
                interaction.deleteReply()

            }
                break;
        }
    },
})