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
    async execute(interaction, client) {
        await interaction.deferReply();
        let songplayed;
        let timeListened;
        const data = await played_1.default.findOne({ User: interaction.user.id });
        if (!data) {
            songplayed = 0, timeListened = "0";
        }
        else {
            songplayed = data.Played, timeListened = (0, pretty_ms_1.default)(data.Time, { verbose: true });
        }
        const buffer = await (0, discord_arts_1.profileImage)(interaction.user.id, {
            customTag: 'Keep Syncing',
            customBackground: './Assets/profile.png',
            overwriteBadges: true,
            borderColor: [client.color],
            presenceStatus: 'dnd'
        });
        const attachment = new discord_js_1.AttachmentBuilder(buffer, { name: 'profile.png' });
        const Profile = new discord_js_1.EmbedBuilder()
            .setColor(client.data.color)
            .setImage("attachment://profile.png")
            .setDescription(`**Songs Played - ${songplayed} | Listened for - ${timeListened}**`);
        return interaction.editReply({ embeds: [Profile], files: [attachment] });
    }
});
