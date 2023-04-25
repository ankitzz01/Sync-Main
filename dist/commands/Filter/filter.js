"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_js_1 = require("../../structure/index.js");
exports.default = new index_js_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName("filter")
        .setDescription("filter")
        .addSubcommand(sub => sub.setName('nightcore')
        .setDescription('Applies a nightcore filter'))
        .addSubcommand(sub => sub.setName('vaporwave')
        .setDescription('Applies a vaporwave filter'))
        .addSubcommand(sub => sub.setName('bassboost')
        .setDescription('Applies a bassboost filter'))
        .addSubcommand(sub => sub.setName('pop')
        .setDescription('Applies a pop filter'))
        .addSubcommand(sub => sub.setName('soft')
        .setDescription('Applies a soft filter'))
        .addSubcommand(sub => sub.setName('treblebass')
        .setDescription('Applies a treblebass filter'))
        .addSubcommand(sub => sub.setName('8d')
        .setDescription('Applies a 8D filter'))
        .addSubcommand(sub => sub.setName('karaoke')
        .setDescription('Applies a karaoke filter'))
        .addSubcommand(sub => sub.setName('vibrato')
        .setDescription('Applies a vibrato filter'))
        .addSubcommand(sub => sub.setName('tremolo')
        .setDescription('Applies a tremolo filter'))
        .addSubcommand(sub => sub.setName('clear')
        .setDescription('Clears the applied filter')),
    category: "Filter",
    async execute(interaction, client) {
        const player = client.player.players.get(`${interaction.guild?.id}`);
        if (await (0, index_js_1.botVC)(interaction))
            return;
        if (await (0, index_js_1.memberVoice)(interaction))
            return;
        if (await (0, index_js_1.differentVoice)(interaction))
            return;
        if (!player)
            return interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder()
                        .setColor("Red")
                        .setDescription("No song player was found")
                ], ephemeral: true
            });
        if (!player.playing)
            return interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder()
                        .setColor("Red")
                        .setDescription("No song was found playing")
                ], ephemeral: true
            });
        const Sub = interaction.options.getSubcommand();
        await interaction.deferReply();
        const Embed = new discord_js_1.EmbedBuilder()
            .setColor(client.data.color);
        switch (Sub) {
            case "nightcore":
                {
                    player.nightcore = true;
                    interaction.editReply({ embeds: [Embed.setDescription(`Successfully applied the **${Sub}** filter`)] });
                }
                break;
            case "vaporwave":
                {
                    player.vaporwave = true;
                    interaction.editReply({ embeds: [Embed.setDescription(`Successfully applied the **${Sub}** filter`)] });
                }
                break;
            case "bassboost":
                {
                    player.bassboost = true;
                    interaction.editReply({ embeds: [Embed.setDescription(`Successfully applied the **${Sub}** filter`)] });
                }
                break;
            case "pop":
                {
                    player.pop = true;
                    interaction.editReply({ embeds: [Embed.setDescription(`Successfully applied the **${Sub}** filter`)] });
                }
                break;
            case "soft":
                {
                    player.soft = true;
                    interaction.editReply({ embeds: [Embed.setDescription(`Successfully applied the **${Sub}** filter`)] });
                }
                break;
            case "treblebass":
                {
                    player.treblebass = true;
                    interaction.editReply({ embeds: [Embed.setDescription(`Successfully applied the **${Sub}** filter`)] });
                }
                break;
            case "8d":
                {
                    player.eightd = true;
                    interaction.editReply({ embeds: [Embed.setDescription(`Successfully applied the **${Sub}** filter`)] });
                }
                break;
            case "karaoke":
                {
                    player.karaoke = true;
                    interaction.editReply({ embeds: [Embed.setDescription(`Successfully applied the **${Sub}** filter`)] });
                }
                break;
            case "vibrato":
                {
                    player.vibrato = true;
                    interaction.editReply({ embeds: [Embed.setDescription(`Successfully applied the **${Sub}** filter`)] });
                }
                break;
            case "tremolo":
                {
                    player.tremolo = true;
                    interaction.editReply({ embeds: [Embed.setDescription(`Successfully applied the **${Sub}** filter`)] });
                }
                break;
            case "clear":
                {
                    await player.reset();
                    interaction.editReply({ embeds: [Embed.setDescription(`Successfully cleared the filters`)] });
                }
                break;
        }
    }
});
