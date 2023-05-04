import { SlashCommandBuilder } from "discord.js";
import { SlashCommand, memberVoice, botVC, differentVoice, reply, editReply } from "../../structure";

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the current track'),
    category: "Music",
    async execute(interaction, client) {

        if (await memberVoice(interaction)) return
        if (await botVC(interaction)) return
        if (await differentVoice(interaction)) return

        const player = client.player.players.get(interaction.guild?.id as string)
        if (!player) return reply(interaction, "❌", "No song player was found", true)
        if (player.paused) return reply(interaction, "❌", "The player is already paused", true)

        await interaction.deferReply()

        player.pause(true)

        return editReply(interaction, "⏸", "**Paused** the player")
    }
})