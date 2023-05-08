"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const structure_1 = require("../../structure");
exports.default = new structure_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName('rewind')
        .setDescription('Rewind a certain amount of seconds backwards')
        .addIntegerOption(opt => opt.setName('seconds')
        .setDescription('Enter the amount of seconds to rewind')
        .setRequired(true)
        .setMinValue(1).setMaxValue(360)),
    category: "Music",
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
        if (!player.queue.current)
            return (0, structure_1.reply)(interaction, "❌", "No song was found playing", true);
        const rewindAmount = interaction.options.getInteger("seconds", true);
        let seektime = player.position - rewindAmount * 1000;
        await interaction.deferReply();
        if (seektime >= player.queue.current.duration - player.position || seektime < 0)
            seektime = 0;
        player.seek(seektime);
        return (0, structure_1.editReply)(interaction, "⏪", `Rewinded **${rewindAmount}** seconds backward`);
    },
});
