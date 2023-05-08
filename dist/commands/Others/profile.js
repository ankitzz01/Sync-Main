"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const played_1 = __importDefault(require("../../schemas/played"));
const discord_arts_1 = require("discord-arts");
const pretty_ms_1 = __importDefault(require("pretty-ms"));
const index_js_1 = require("../../structure/index.js");
exports.default = new index_js_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName("profile")
        .setDescription("Check your Sync profile"),
    category: "Others",
    voteOnly: true,
    async execute(interaction, client) {
        await interaction.deferReply();
        const data = await played_1.default.findOne({ User: interaction.user.id });
        return interaction.editReply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor(client.data.color)
                    .setImage("attachment://profile.png")
                    .setDescription(`**Songs Played - ${data ? data.Played : 0} | Listened for - ${data ? (0, pretty_ms_1.default)(data.Time, { verbose: true }) : 0}**`)
            ],
            files: [
                new discord_js_1.AttachmentBuilder(await (0, discord_arts_1.profileImage)(interaction.user.id, {
                    customTag: 'Keep Syncing',
                    customBackground: 'dist/assets/profile.png',
                    overwriteBadges: true,
                    borderColor: [client.color],
                    presenceStatus: 'dnd'
                }), { name: 'profile.png' })
            ]
        });
    }
});
