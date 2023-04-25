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
        const Manager = client.player;
        const player = Manager.players.get(interaction.guild?.id);
        if (!player)
            return interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder()
                        .setColor("DarkRed")
                        .setDescription("No song player was found")
                ], ephemeral: true
            });
        if (!player.queue.current)
            return interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder()
                        .setColor("DarkRed")
                        .setDescription("No song was found playing")
                ], ephemeral: true
            });
        const rewindAmount = interaction.options.getInteger("seconds");
        let seektime = player.position - Number(rewindAmount) * 1000;
        await interaction.deferReply();
        if (seektime >= player.queue.current.duration - player.position || seektime < 0)
            seektime = 0;
        player.seek(Number(seektime));
        const Embed = new discord_js_1.EmbedBuilder()
            .setColor(client.data.color)
            .setDescription(`⏪ | Rewinded **${rewindAmount}** seconds backward`);
        return interaction.editReply({ embeds: [Embed] });
    },
});
