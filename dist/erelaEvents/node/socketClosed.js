"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const tempbutton_js_1 = __importDefault(require("../../schemas/tempbutton.js"));
const musicchannel_js_1 = __importDefault(require("../../schemas/musicchannel.js"));
const index_js_1 = require("../../structure/index.js");
const index_js_2 = require("../../structure/functions/index.js");
const button_1 = require("../../systems/button");
exports.default = new index_js_1.PlayerEvent({
    name: "socketClosed",
    async execute(player, payload, client) {
        if (player.textChannel === null)
            return;
        const Channel = await client.channels.fetch(player.textChannel).catch(() => { });
        if (!Channel)
            return;
        const data = await tempbutton_js_1.default.find({ Guild: player.guild, Channel: player.textChannel });
        for (let i = 0; i < data.length; i++) {
            const msg = await Channel.messages.fetch(data[i].MessageID).catch(() => { });
            if (msg && msg.editable)
                await msg.edit({ components: [button_1.buttonDisable] });
            await data[i].delete();
        }
        const setupUpdateEmbed = new discord_js_1.EmbedBuilder()
            .setColor(client.color)
            .setTitle(`No song playing currently`)
            .setImage(client.data.links.background)
            .setDescription(`**[Invite Me](${client.data.links.invite})  :  [Support Server](${client.data.links.support})  :  [Vote Me](${client.data.topgg.vote})**`);
        await (0, index_js_2.musicSetupUpdate)(client, player, musicchannel_js_1.default, setupUpdateEmbed);
        player.destroy();
    },
});
