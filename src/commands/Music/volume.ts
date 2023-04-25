import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand, memberVoice, botVC, differentVoice } from "../../structure";

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Change the volume of the player')
        .addIntegerOption(opt => 
            opt.setName('volume')
                .setDescription('Enter the volume to set (Ex: 80)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        ),
    category: "Music",
    async execute(interaction, client) {

        const player = client.player.players.get(interaction.guild?.id as string)

        if (await memberVoice(interaction)) return
        if (await botVC(interaction)) return
        if (await differentVoice(interaction)) return

        if (!player) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("No song player was found")
            ], ephemeral: true
        })

        const vol = interaction.options.getInteger("volume", true)

        await interaction.deferReply()

        player.setVolume(vol)

        return interaction.editReply({
            embeds: [new EmbedBuilder()
                .setColor(client.data.color)
                .setDescription(`🔊 | **Volume** set to ${vol}`)
            ]
        })
    }
})