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
        if (await (0, index_js_1.botVC)(interaction))
            return;
        if (await (0, index_js_1.memberVoice)(interaction))
            return;
        if (await (0, index_js_1.differentVoice)(interaction))
            return;
        const player = client.player.players.get(interaction.guild?.id);
        if (!player)
            return (0, index_js_1.reply)(interaction, "❌", "No song player was found", true);
        if (!player.playing)
            return (0, index_js_1.reply)(interaction, "❌", "No song was found playing", true);
        await interaction.deferReply();
        switch (interaction.options.getSubcommand()) {
            case "nightcore":
                {
                    player.nightcore = true;
                    (0, index_js_1.editReply)(interaction, "✅", `Successfully applied the **${interaction.options.getSubcommand()}** filter`);
                }
                break;
            case "vaporwave":
                {
                    player.vaporwave = true;
                    (0, index_js_1.editReply)(interaction, "✅", `Successfully applied the **${interaction.options.getSubcommand()}** filter`);
                }
                break;
            case "bassboost":
                {
                    player.bassboost = true;
                    (0, index_js_1.editReply)(interaction, "✅", `Successfully applied the **${interaction.options.getSubcommand()}** filter`);
                }
                break;
            case "pop":
                {
                    player.pop = true;
                    (0, index_js_1.editReply)(interaction, "✅", `Successfully applied the **${interaction.options.getSubcommand()}** filter`);
                }
                break;
            case "soft":
                {
                    player.soft = true;
                    (0, index_js_1.editReply)(interaction, "✅", `Successfully applied the **${interaction.options.getSubcommand()}** filter`);
                }
                break;
            case "treblebass":
                {
                    player.treblebass = true;
                    (0, index_js_1.editReply)(interaction, "✅", `Successfully applied the **${interaction.options.getSubcommand()}** filter`);
                }
                break;
            case "8d":
                {
                    player.eightd = true;
                    (0, index_js_1.editReply)(interaction, "✅", `Successfully applied the **${interaction.options.getSubcommand()}** filter`);
                }
                break;
            case "karaoke":
                {
                    player.karaoke = true;
                    (0, index_js_1.editReply)(interaction, "✅", `Successfully applied the **${interaction.options.getSubcommand()}** filter`);
                }
                break;
            case "vibrato":
                {
                    player.vibrato = true;
                    (0, index_js_1.editReply)(interaction, "✅", `Successfully applied the **${interaction.options.getSubcommand()}** filter`);
                }
                break;
            case "tremolo":
                {
                    player.tremolo = true;
                    (0, index_js_1.editReply)(interaction, "✅", `Successfully applied the **${interaction.options.getSubcommand()}** filter`);
                }
                break;
            case "clear":
                {
                    await player.reset();
                    (0, index_js_1.editReply)(interaction, "✅", "Successfully cleared the filters");
                }
                break;
        }
    }
});
