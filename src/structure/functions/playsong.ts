import { EmbedBuilder, ChatInputCommandInteraction, ModalSubmitInteraction, ButtonInteraction, AnySelectMenuInteraction } from "discord.js"
import { Player } from "erela.js"
import { CustomClient, editReply, msToTimestamp } from "../../structure/index.js"

type ValidInteraction = ChatInputCommandInteraction |
    ModalSubmitInteraction |
    ButtonInteraction |
    AnySelectMenuInteraction

export async function playSong(interaction: ValidInteraction, client: CustomClient, player: Player, query: string) {

    try {

        if (player.state !== "CONNECTED") player.connect()
        let res = await player.search(query, interaction.user)
        const link = `https://www.google.com/search?q=${encodeURIComponent(res.tracks[0].title)}`

        switch (res.loadType) {
            case "LOAD_FAILED": {
                if (!player.queue.current) player.destroy()
                editReply(interaction, "❌", "Something went wrong while playing the requested song")
            }
                break;

            case "NO_MATCHES": {
                if (!player.queue.current) player.destroy()
                editReply(interaction, "❌", "No result found")
            }
                break;

            case "PLAYLIST_LOADED": {
                player.queue.add(res.tracks)
                if (!player.playing && !player.paused && !player.queue.size) await player.play()

                interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setColor(client.data.color)
                        .setAuthor({ name: "ADDED TO QUEUE", iconURL: interaction.user.displayAvatarURL(), url: client.data.links.invite })
                        .setDescription(`[\`\`${res.tracks[0].title}\`\`](${link})\n\nAdded by: ${interaction.user} | Duration: \`❯ ${msToTimestamp(res.tracks[0].duration)}\``)]
                })
            }
                break;

            default: {
                player.queue.add(res.tracks[0])
                if (!player.playing && !player.paused && !player.queue.size) await player.play()

                interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setColor(client.data.color)
                        .setAuthor({ name: "ADDED TO QUEUE", iconURL: interaction.user.displayAvatarURL(), url: client.data.links.invite })
                        .setDescription(`[\`\`${res.tracks[0].title}\`\`](${link})\n\n**Added by: ${interaction.user} | Duration: **\`\`❯ ${msToTimestamp(res.tracks[0].duration)}\`\``)
                    ]
                })
            }
                break;
        }

    } catch (error) {
        editReply(interaction, "❌", `Something went wrong! Please report to us using \`/report\`.`)
        return console.log(error)
    }
}