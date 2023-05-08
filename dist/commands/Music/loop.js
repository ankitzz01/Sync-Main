"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const structure_1 = require("../../structure");
exports.default = new structure_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName('loop')
        .setDescription('Loop the current song or queue')
        .addStringOption(opt => opt.setName('mode')
        .setDescription('Configure the loop settings')
        .setRequired(true)
        .addChoices({
        name: "Track",
        value: "track"
    }, {
        name: "Queue",
        value: "queue"
    }, {
        name: "Disable",
        value: "off"
    })),
    category: "Music",
    voteOnly: true,
    async execute(interaction, client) {
        if (await (0, structure_1.memberVoice)(interaction))
            return;
        if (await (0, structure_1.botVC)(interaction))
            return;
        if (await (0, structure_1.differentVoice)(interaction))
            return;
        const player = client.player.players.get(interaction.guild?.id);
        if (!player)
            return (0, structure_1.reply)(interaction, "❌", "No song player was found", true);
        switch (interaction.options.getString("mode", true)) {
            case "track":
                {
                    if (player.trackRepeat)
                        return (0, structure_1.reply)(interaction, "❌", "This song is already being looped", true);
                    if (player.queueRepeat)
                        return (0, structure_1.reply)(interaction, "❌", "The queue is already being looped", true);
                    await interaction.deferReply();
                    player.setTrackRepeat(true);
                    (0, structure_1.editReply)(interaction, "🔄", "**Looping** the current track");
                }
                break;
            case "queue":
                {
                    if (player.trackRepeat)
                        return (0, structure_1.reply)(interaction, "❌", "This song is already being looped", true);
                    if (player.queueRepeat)
                        return (0, structure_1.reply)(interaction, "❌", "The queue is already being looped", true);
                    await interaction.deferReply();
                    player.setQueueRepeat(true);
                    (0, structure_1.editReply)(interaction, "🔄", "Looping the queue");
                }
                break;
            case "off":
                {
                    if (!player.trackRepeat && !player.queueRepeat)
                        return (0, structure_1.reply)(interaction, "❌", "The loop mode is already disabled", true);
                    await interaction.deferReply();
                    player.setTrackRepeat(false);
                    player.setQueueRepeat(false);
                    (0, structure_1.editReply)(interaction, "✅", "The loop mode has been disabled");
                }
                break;
        }
    }
});
