const { EmbedBuilder, Client, SlashCommandBuilder } = require("discord.js")
const check = require("../../Functions/check")

module.exports = {

    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('View the queue'),
    category: "Music",

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction, client) {

        const { guild } = interaction

        if (await check.memberVoice(interaction)) return
        if (await check.botVC(interaction)) return
        if (await check.differentVoice(interaction)) return

        const Manager = client.player
        const player = Manager.players.get(guild.id)

        if (!player.queue.length) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor(client.color)
                .setDescription("⚠ | There is nothing in the queue")
            ], ephemeral: true
        })

        await interaction.deferReply()

        const queue = player.queue.map(
            (t, i) => `\`${++i}.\` [\`${t.title}\`](https://google.com/search?q=${encodeURIComponent(t.title)}) | ${t.requester}`
        )

        const util = class Util {
            static chunk(arr, size) {
                const temp = [];
                for (let i = 0; i < arr.length; i += size) {
                    temp.push(arr.slice(i, i + size))
                }
                return temp
            }
        }

        const chunked = util.chunk(queue, 10).map((x) => x.join("\n"))

        const queueEmbed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: `${guild.name}'s Queue`, iconURL: guild.iconURL() })
            .setDescription(chunked[0])
            .setTimestamp()

        return interaction.editReply({
            embeds: [queueEmbed],
        })
    }
}
