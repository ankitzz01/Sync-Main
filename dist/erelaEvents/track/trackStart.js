"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_js_1 = require("../../structure/index.js");
const tempbutton_js_1 = __importDefault(require("../../schemas/tempbutton.js"));
const promises_1 = __importDefault(require("node:timers/promises"));
const musicchannel_js_1 = __importDefault(require("../../schemas/musicchannel.js"));
const setupUpdate_js_1 = require("../../structure/functions/setupUpdate.js");
const button_js_1 = require("../../systems/button.js");
exports.default = new index_js_1.PlayerEvent({
    name: "trackStart",
    async execute(player, track, type, client) {
        if (player.textChannel === null)
            return;
        const Channel = await client.channels.fetch(player.textChannel).catch(() => { });
        if (!Channel)
            return;
        if (Channel.type !== discord_js_1.ChannelType.GuildText)
            return;
        if (!Channel.guild?.members.me?.permissionsIn(Channel).has(discord_js_1.PermissionFlagsBits.SendMessages))
            return;
        let link = `https://www.google.com/search?q=${encodeURIComponent(track.title)}`;
        let msg;
        const cdata = await musicchannel_js_1.default.findOne({ Guild: player.guild, Channel: player.textChannel });
        if (!cdata) {
            msg = await Channel.send({
                embeds: [new discord_js_1.EmbedBuilder()
                        .setColor("Blue")
                        .setAuthor({ name: "NOW PLAYING", iconURL: track.requester.displayAvatarURL(), url: client.data.links.invite })
                        .setDescription(`[\`\`${track.title}\`\`](${link})`)
                        .addFields({ name: 'Requested by', value: `\`${track.requester.username}\``, inline: true }, { name: 'Song by', value: `\`${track.author}\``, inline: true }, { name: 'Duration', value: `\`❯ ${(0, index_js_1.msToTimestamp)(track.duration)}\``, inline: true })],
                components: [button_js_1.buttonEnable]
            }).catch(() => { });
        }
        const setupUpdateEmbed = new discord_js_1.EmbedBuilder()
            .setColor(client.data.color)
            .setAuthor({ name: "NOW PLAYING", iconURL: track.requester.displayAvatarURL() })
            .setDescription(`[\`\`${track.title}\`\`](${link})`)
            .addFields({ name: 'Requested by', value: `<@${track.requester.id}>`, inline: true }, { name: 'Song by', value: `\`${track.author}\``, inline: true }, { name: 'Duration', value: `\`❯ ${(0, index_js_1.msToTimestamp)(track.duration)}\``, inline: true })
            .setImage(`${track.displayThumbnail("maxresdefault") || client.data.links.background}`);
        await (0, setupUpdate_js_1.musicSetupUpdate)(client, player, musicchannel_js_1.default, setupUpdateEmbed);
        if (!cdata) {
            const buttonData = new tempbutton_js_1.default({
                Guild: player.guild,
                Channel: player.textChannel,
                MessageID: msg?.id
            });
            await promises_1.default.setTimeout(2000);
            await buttonData.save();
        }
    }
});
