import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand, memberVoice, botVC, differentVoice } from "../../structure";

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName('rewind')
        .setDescription('Rewind a certain amount of seconds backwards')
        .addIntegerOption(opt =>
            opt.setName('seconds')
                .setDescription('Enter the amount of seconds to rewind')
                .setRequired(true)
                .setMinValue(1).setMaxValue(360)
        ),
        category: "Music",

    async execute(interaction, client) {

        if (await memberVoice(interaction)) return
        if (await botVC(interaction)) return
        if (await differentVoice(interaction)) return

        const Manager = client.player
        const player = Manager.players.get(interaction.guild?.id as string)


        if (!player) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("No song player was found")
            ], ephemeral: true
        })

        if (!player.queue.current) return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("No song was found playing")
            ], ephemeral: true
        })

        const rewindAmount = interaction.options.getInteger("seconds")

        let seektime = player.position - Number(rewindAmount) * 1000

        await interaction.deferReply()

        if ( seektime >= (player.queue.current.duration as number) - player.position || seektime < 0) seektime = 0

        player.seek(Number(seektime))

        const Embed = new EmbedBuilder()
            .setColor(client.data.color)
            .setDescription(`⏪ | Rewinded **${rewindAmount}** seconds backward`)

        return interaction.editReply({ embeds: [Embed] })
    },
})