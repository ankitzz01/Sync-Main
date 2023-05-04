import { SlashCommandBuilder } from "discord.js";
import { SlashCommand, memberVoice, differentVoice, botVC, joinable, reply, editReply } from "../../structure/index.js";

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName('back')
        .setDescription('Plays the previous song'),
    category: "Music",

    async execute(interaction, client) {

        if (await memberVoice(interaction)) return
        if (await differentVoice(interaction)) return
        if (await botVC(interaction)) return
        if (await joinable(interaction)) return

        const player = client.player.players.get(interaction.guild?.id as string)
        if (!player) return reply(interaction, "❌", "No song player was found", true)
        if (!player.queue.previous) return reply(interaction, "❌", "No previous song was found", true)

        await interaction.deferReply()

        let res = await player.search(player.queue.previous.uri as string, interaction.user)

        if (player.state !== "CONNECTED") player.connect()

        player.queue.add(res.tracks[0])
        player.stop()
        player.pause(false)
        if (
            !player.playing &&
            !player.paused &&
            player.queue.totalSize === res.tracks.length
        )
            await player.play()

        return editReply(interaction, "⏮", "Playing the **previous** song")
    },
})