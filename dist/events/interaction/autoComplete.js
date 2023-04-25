"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../structure/index.js");
const discord_js_1 = require("discord.js");
const youtube_sr_1 = __importDefault(require("youtube-sr"));
const playlist_js_1 = __importDefault(require("../../schemas/playlist.js"));
exports.default = new index_js_1.Event({
    name: discord_js_1.Events.InteractionCreate,
    async execute(interaction, client) {
        if (!interaction.isAutocomplete())
            return;
        switch (interaction.commandName) {
            case "play":
                {
                    const query = interaction.options?.getString('query');
                    if (!query)
                        return;
                    if (query.length <= 1)
                        return;
                    let choices = [];
                    const searched = await youtube_sr_1.default.search(query, {
                        limit: 4,
                        type: 'video'
                    });
                    const filtered = searched.filter(m => m.private === false);
                    filtered.forEach((x) => {
                        choices.push({
                            name: x.title?.slice(0, 100),
                            value: x.url
                        });
                    });
                    await interaction.respond(choices);
                }
                break;
            case "playlist":
                {
                    const playlist = interaction.options?.getString('playlist');
                    if (!playlist)
                        return;
                    const data = await playlist_js_1.default.findOne({ User: interaction.user.id }).catch(err => { });
                    if (!data || !data.Playlist || data.Playlist.length < 1)
                        return;
                    let choices = [];
                    const searched = data.Playlist;
                    searched.forEach(x => {
                        choices.push({
                            name: x.name,
                            value: x.name
                        });
                    });
                    await interaction.respond(choices);
                }
                break;
        }
    },
});
