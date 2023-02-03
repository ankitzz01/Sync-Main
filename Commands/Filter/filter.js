const { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } = require("discord.js")
const check = require("../../Functions/check")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("filter")
    .setDescription("filter"),
    name: "filter",
    description: "Filter",
    category: "Filter",
    options: [
        {
            name: "nightcore",
            description: "Applies a nightcore filter",
            type: 1,
        },
        {
            name: "vaporwave",
            description: "Applies a vaporwave filter",
            type: 1,
        },
        {
            name: "bassboost",
            description: "Applies a bassboost filter",
            type: 1,
        },
        {
            name: "pop",
            description: "Applies a pop filter",
            type: 1,
        },
        {
            name: "soft",
            description: "Applies a soft filter",
            type: 1,
        },
        {
            name: "treblebass",
            description: "Applies a treblebass filter",
            type: 1,
        },
        {
            name: "8d",
            description: "Applies a 8D filter",
            type: 1,
        },
        {
            name: "karaoke",
            description: "Applies a karaoke filter",
            type: 1,
        },
        {
            name: "vibrato",
            description: "Applies a vibrato filter",
            type: 1,
        },
        {
            name: "tremolo",
            description: "Applies a tremolo filter",
            type: 1,
        },
        {
            name: "clear",
            description: "Clears the applied filter",
            type: 1,
        },
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options } = interaction

        const Manager = client.player
        const player = Manager.players.get(interaction.guild.id)

        if (await check.botVC(interaction)) return
        if (await check.memberVoice(interaction)) return
        if (await check.differentVoice(interaction)) return

        if (!player) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("Red")
                .setDescription("No song player was found")
            ], ephemeral: true
        })

        if (!player.playing) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("Red")
                .setDescription("No song was found playing")
            ], ephemeral: true
        })

        const Sub = options.getSubcommand()

        await interaction.deferReply()

        const Embed = new EmbedBuilder()
        .setColor(client.color)

        switch (Sub) {

            case "nightcore": {

                player.nightcore = true

                interaction.editReply({embeds: [Embed.setDescription(`Successfully applied the **${Sub}** filter`)]})

            }
                break;
            case "vaporwave": {

                player.vaporwave = true

                interaction.editReply({embeds: [Embed.setDescription(`Successfully applied the **${Sub}** filter`)]})

            }
                break;
            case "bassboost": {

                player.bassboost = true

                interaction.editReply({embeds: [Embed.setDescription(`Successfully applied the **${Sub}** filter`)]})

            }
                break;
            case "pop": {

                player.pop = true

                interaction.editReply({embeds: [Embed.setDescription(`Successfully applied the **${Sub}** filter`)]})

            }
                break;
            case "soft": {

                player.soft = true

                interaction.editReply({embeds: [Embed.setDescription(`Successfully applied the **${Sub}** filter`)]})

            }
                break;
            case "treblebass": {

                player.treblebass = true

                interaction.editReply({embeds: [Embed.setDescription(`Successfully applied the **${Sub}** filter`)]})

            }
                break;
            case "8d": {

                player.eightD = true

                interaction.editReply({embeds: [Embed.setDescription(`Successfully applied the **${Sub}** filter`)]})

            }
                break;
            case "karaoke": {

                player.karaoke = true

                interaction.editReply({embeds: [Embed.setDescription(`Successfully applied the **${Sub}** filter`)]})

            }
                break;
            case "vibrato": {

                player.vibrato = true

                interaction.editReply({embeds: [Embed.setDescription(`Successfully applied the **${Sub}** filter`)]})

            }
                break;
            case "tremolo": {

                player.tremolo = true

                interaction.editReply({embeds: [Embed.setDescription(`Successfully applied the **${Sub}** filter`)]})

            }
                break;

            case "clear": {

                await player.reset()

                interaction.editReply({embeds: [Embed.setDescription(`Successfully cleared the filters`)]})

            }
                break;
        }
    }

}