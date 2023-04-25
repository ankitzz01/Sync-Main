import { EmbedBuilder, ChatInputCommandInteraction, ModalSubmitInteraction, ButtonInteraction, AnySelectMenuInteraction} from "discord.js"
import { Player } from "erela.js"
import { CustomClient, msToTimestamp } from "../../structure/index.js"

type ValidInteraction = ChatInputCommandInteraction |
    ModalSubmitInteraction |
    ButtonInteraction |
    AnySelectMenuInteraction

export async function playSong(interaction: ValidInteraction, client: CustomClient, player: Player, query: string) {

    let res

    if (player.state !== "CONNECTED") player.connect()

    try {

        res = await player.search(query, interaction.user)

        if (res.loadType === "LOAD_FAILED") {

            if (!player.queue.current) player.destroy()
            return interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setColor("DarkRed")
                    .setDescription(`An error has occured!`)
                ]
            })

        } else if (res.loadType === "NO_MATCHES") {
            if (!player.queue.current) player.destroy()
            return interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setColor("DarkRed")
                    .setDescription(`No result found for the query`)
                ]
            })
        } else if (res.loadType === "PLAYLIST_LOADED") {

            player.queue.add(res.tracks)
            if (!player.playing && !player.paused && !player.queue.size) await player.play()

            let link = `https://www.google.com/search?q=${encodeURIComponent(res.tracks[0].title)}`

            return interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setColor(client.data.color)
                    .setAuthor({ name: "ADDED TO QUEUE", iconURL: interaction.user.displayAvatarURL(), url: client.data.links.invite })
                    .setDescription(`[\`\`${res.tracks[0].title}\`\`](${link})\n\nAdded by: ${interaction.user} | Duration: \`❯ ${msToTimestamp(res.tracks[0].duration)}\``)
                ]
            })

        } else if (["TRACK_LOADED", "SEARCH_RESULT"].includes(res.loadType)) {

            let link = `https://www.google.com/search?q=${encodeURIComponent(res.tracks[0].title)}`

            player.queue.add(res.tracks[0])
            if (!player.playing && !player.paused && !player.queue.size) await player.play()

            return interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setColor(client.data.color)
                    .setAuthor({ name: "ADDED TO QUEUE", iconURL: interaction.user.displayAvatarURL(), url: client.data.links.invite })
                    .setDescription(`[\`\`${res.tracks[0].title}\`\`](${link})\n\n**Added by: ${interaction.user} | Duration: **\`\`❯ ${msToTimestamp(res.tracks[0].duration)}\`\``)
                ]
            })
        }

    } catch (error) {
        interaction.editReply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription(`An **error** has occured! Please report to us using \`/report\`.`)
            ]
        })
        
        return console.log(error)
    }
    
}