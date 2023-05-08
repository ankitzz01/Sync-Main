"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const structure_1 = require("../../structure");
exports.default = new structure_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the queue'),
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
        if (!player.queue.length)
            return (0, structure_1.reply)(interaction, "❌", "There is nothing in the queue", true);
        await interaction.deferReply();
        player.queue.shuffle();
        return (0, structure_1.editReply)(interaction, "🔀", "**Shuffled** the queue");
    },
});
