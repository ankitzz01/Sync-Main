const { EmbedBuilder, Client, ChatInputCommandInteraction } = require("discord.js")
const check = require("../../Functions/check")

module.exports = {
    name: 'loop',
    description: 'Loop the current song or queue',
    category: "Music",
    options: [
        {
            name: "mode",
            description: "Configure the loop settings",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Track",
                    value: "song"
                },
                {
                    name: "Queue",
                    value: "playlist"
                },
                {
                    name: "Disable",
                    value: "off"
                },
            ]
        }
    ],
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction, client) {

        const { options } = interaction

        const Manager = client.player
        const player = Manager.players.get(interaction.guild.id)

        if (await check.memberVoice(interaction)) return
        if (await check.botVC(interaction)) return
        if (await check.differentVoice(interaction)) return

        if (!player) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("No song player was found")
            ], ephemeral: true
        })

        const choice = options.getString("mode")

        if (choice == "song") {

            if (player.trackRepeat) return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor("DarRed")
                    .setDescription(`This song is already being looped`)
                ], ephemeral: true
            })

            if (player.queueRepeat) return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor("DarkRed")
                    .setDescription(`The queue is already being looped`)
                ], ephemeral: true
            })

            await interaction.deferReply()

            player.setTrackRepeat(true)

            return interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(`🔄 | **Looping** the current track`)
                ]
            })
        }

        if (choice == "playlist") {

            if (player.trackRepeat) return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor("DarkRed")
                    .setDescription(`This song is already being looped`)
                ], ephemeral: true
            })

            if (player.queueRepeat) return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor("DarkRed")
                    .setDescription(`The queue is already being looped`)
                ], ephemeral: true
            })

            await interaction.deferReply()

            player.setQueueRepeat(true)

            return interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(`🔄 | Looping the queue`)
                ]
            })
        }


        if (choice == "off") {

            if (!player.trackRepeat && !player.queueRepeat) return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor("DarkRed")
                    .setDescription(`The loop mode is already disabled`)
                ], ephemeral: true
            })

            await interaction.deferReply()

            player.setTrackRepeat(false)
            player.setQueueRepeat(false)

            return interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(`✅ | The loop mode has been disabled`)
                ]
            })
        }
    }

}