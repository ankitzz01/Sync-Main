import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand, memberVoice, botVC, differentVoice } from "../../structure";

export default new SlashCommand({

    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('View the queue'),
    category: "Music",

    async execute(interaction, client) {

        if (await memberVoice(interaction)) return
        if (await botVC(interaction)) return
        if (await differentVoice(interaction)) return

        const player = client.player.players.get(interaction.guild?.id as string)

        if (!player) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("No song player was found")
            ], ephemeral: true
        })

        if (!player.queue?.length) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor(client.data.color)
                .setDescription("❕ | There is nothing in the queue")
            ], ephemeral: true
        })

        await interaction.deferReply()

        const queue = player.queue.map(
            (t, i) => `\`${++i}.\` [\`${t.title}\`](https://google.com/search?q=${encodeURIComponent(t.title)}) | ${t.requester}`
        )

        const util = class Util {
            static chunk(arr: string[], size: number) {
                const temp = [];
                for (let i = 0; i < arr.length; i += size) {
                    temp.push(arr.slice(i, i + size))
                }
                return temp
            }
        }

        const chunked = util.chunk(queue, 10).map((x) => x.join("\n"))

        const queueEmbed = new EmbedBuilder()
            .setColor(client.data.color)
            .setAuthor({ name: `${interaction.guild?.name}'s Queue`, iconURL: interaction.guild?.iconURL() as string })
            .setDescription(chunked[0])
            .setTimestamp()

        return interaction.editReply({
            embeds: [queueEmbed],
        })
    }
})
