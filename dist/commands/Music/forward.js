"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const structure_1 = require("../../structure");
exports.default = new structure_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName('forward')
        .setDescription('Skip a certain amount of seconds forward')
        .addIntegerOption(opt => opt.setName('seconds')
        .setDescription('Enter the amount of seconds to seek forward')
        .setRequired(true)
        .setMinValue(1).setMaxValue(360)),
    category: "Music",
    async execute(interaction, client) {
        if (await (0, structure_1.botVC)(interaction))
            return;
        if (await (0, structure_1.memberVoice)(interaction))
            return;
        if (await (0, structure_1.differentVoice)(interaction))
            return;
        const player = client.player.players.get(interaction.guild?.id);
        if (!player)
            return (0, structure_1.reply)(interaction, "❌", "No song player was found", true);
        if (!player.playing || !player.queue.current)
            return (0, structure_1.reply)(interaction, "❌", "No song was found playing", true);
        await interaction.deferReply();
        const forwardAmount = interaction.options.getInteger("seconds");
        let seektime = Number(player.position) + Number(forwardAmount) * 1000;
        if (Number(forwardAmount) <= 0)
            seektime = Number(player.position);
        if (Number(seektime) >= player.queue.current.duration)
            seektime = player.queue.current.duration - 1000;
        player.seek(Number(seektime));
        return (0, structure_1.editReply)(interaction, "⏩", `Skipped **${forwardAmount}** seconds forward`);
    }
});
