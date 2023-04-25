import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand, botVC, memberVoice, differentVoice } from "../../structure";

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName('forward')
        .setDescription('Skip a certain amount of seconds forward')
        .addIntegerOption(opt =>
            opt.setName('seconds')
                .setDescription('Enter the amount of seconds to seek forward')
                .setRequired(true)
                .setMinValue(1).setMaxValue(360)
        ),
    category: "Music",
    async execute(interaction, client) {

        const player = client.player.players.get(interaction.guild?.id as string)

        if (await botVC(interaction)) return
        if (await memberVoice(interaction)) return
        if (await differentVoice(interaction)) return

        if (!player) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("No song player was found")
            ], ephemeral: true
        })

        if (!player.playing || !player.queue.current) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("No song was found playing")
            ], ephemeral: true
        })

        await interaction.deferReply()

        const forwardAmount = interaction.options.getInteger("seconds")

        let seektime = Number(player.position) + Number(forwardAmount) * 1000

        if (Number(forwardAmount) <= 0) seektime = Number(player.position)

        if (Number(seektime) >= (player.queue.current.duration as number)) seektime = player.queue.current.duration as number - 1000

        player.seek(Number(seektime))

        const Embed = new EmbedBuilder()
            .setColor(client.data.color)
            .setDescription(`⏩ | Skipped **${forwardAmount}** seconds forward`)
        return interaction.editReply({ embeds: [Embed] })

    }
})