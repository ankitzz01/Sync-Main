import { SlashCommandBuilder } from "discord.js";
import { SlashCommand, memberVoice, botVC, differentVoice, reply, editReply } from "../../structure";

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Loop the current song or queue')
        .addStringOption(opt =>
            opt.setName('mode')
                .setDescription('Configure the loop settings')
                .setRequired(true)
                .addChoices({
                    name: "Track",
                    value: "track"
                },
                    {
                        name: "Queue",
                        value: "queue"
                    },
                    {
                        name: "Disable",
                        value: "off"
                    })
        ),
    category: "Music",
    voteOnly: true,

    async execute(interaction, client) {

        if (await memberVoice(interaction)) return
        if (await botVC(interaction)) return
        if (await differentVoice(interaction)) return

        const player = client.player.players.get(interaction.guild?.id as string)
        if (!player) return reply(interaction, "❌", "No song player was found", true)

        switch (interaction.options.getString("mode", true)) {

            case "track": {
                if (player.trackRepeat) return reply(interaction, "❌", "This song is already being looped", true)
                if (player.queueRepeat) return reply(interaction, "❌", "The queue is already being looped", true)

                await interaction.deferReply()
                player.setTrackRepeat(true)

                editReply(interaction, "🔄", "**Looping** the current track")
            }
                break;

            case "queue": {
                if (player.trackRepeat) return reply(interaction, "❌", "This song is already being looped", true)
                if (player.queueRepeat) return reply(interaction, "❌", "The queue is already being looped", true)

                await interaction.deferReply()
                player.setQueueRepeat(true)

                editReply(interaction, "🔄", "Looping the queue")
            }
                break;

            case "off": {
                if (!player.trackRepeat && !player.queueRepeat) return reply(
                    interaction, "❌", "The loop mode is already disabled", true
                )

                await interaction.deferReply()

                player.setTrackRepeat(false)
                player.setQueueRepeat(false)

                editReply(interaction, "✅", "The loop mode has been disabled")
            }
                break;
        }
    }
})