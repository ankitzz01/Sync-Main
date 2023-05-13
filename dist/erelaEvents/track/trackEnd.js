"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const played_js_1 = __importDefault(require("../../schemas/played.js"));
const tempbutton_js_1 = __importDefault(require("../../schemas/tempbutton.js"));
const button_js_1 = require("../../systems/button.js");
const index_1 = require("../../structure/index");
exports.default = new index_1.PlayerEvent({
    name: "trackEnd",
    async execute(player, track, type, client) {
        if (!track.requester)
            return;
        let data = await played_js_1.default.findOne({ User: track.requester.id }).catch(() => { });
        if (!data) {
            data = new played_js_1.default({
                User: track.requester.id,
                Played: 1,
                Time: Number(track.duration)
            });
            await data.save();
        }
        else {
            data.Played += 1;
            data.Time += Number(track.duration);
            await data.save();
        }
        if (player.textChannel === null)
            return;
        const Channel = await client.channels.fetch(player.textChannel).catch(() => { });
        if (!Channel)
            return;
        if (Channel.type !== discord_js_1.ChannelType.GuildText)
            return;
        const bdata = await tempbutton_js_1.default.find({ Guild: player.guild, Channel: player.textChannel });
        for (let i = 0; i < bdata.length; i++) {
            const msg = await Channel.messages?.fetch(bdata[i].MessageID).catch(() => { });
            if (msg && msg.editable)
                await msg.edit({ components: [button_js_1.buttonDisable] }).catch(() => { });
            if (data && bdata[i])
                await bdata[i].delete();
        }
    }
});
