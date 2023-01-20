const { EmbedBuilder, Client, ChatInputCommandInteraction, ApplicationCommandOptionType } = require("discord.js")
const check = require("../../Functions/check")

module.exports = {
    name: "rewind",
    description: "Rewind a certain amount of seconds backwards",
    options: [
        {
            name: "seconds",
            description: "Enter the amount of seconds to rewind",
            type: ApplicationCommandOptionType.Integer,
            required: true
        }
    ],

    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {

        if (await check.memberVoice(interaction)) return
        if (await check.botVC(interaction)) return
        if (await check.differentVoice(interaction)) return

        const Manager = client.player
        const player = Manager.players.get(interaction.guild.id)


        if (!player) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("No song player was found")
            ], ephemeral: true
        })

        if(!player.queue.current) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("No song was found playing")
            ], ephemeral: true
        })

        const rewindAmount = interaction.options.getInteger("seconds")

        let seektime = player.position - Number(rewindAmount) * 1000

        await interaction.deferReply()

        if (
            seektime >= player.queue.current.duration - player.position ||
            seektime < 0
        ) {
            seektime = 0
        }

        player.seek(Number(seektime))

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`⏪ | Rewinded **${rewindAmount}** seconds backward`)
            
        return interaction.editReply({ embeds: [Embed] })
    },
}