"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const tempbutton_js_1 = __importDefault(require("../../schemas/tempbutton.js"));
const emojis_js_1 = __importDefault(require("../../systems/emojis.js"));
const musicchannel_js_1 = __importDefault(require("../../schemas/musicchannel.js"));
const index_js_1 = require("../../structure/index.js");
const button_js_1 = require("../../systems/button.js");
exports.default = new index_js_1.PlayerEvent({
    name: "queueEnd",
    async execute(player, track, type, client) {
        if (player.textChannel === null)
            return;
        const Channel = await client.channels?.fetch(player.textChannel).catch(() => { });
        if (!Channel)
            return;
        const data = await tempbutton_js_1.default.find({ Guild: player.guild, Channel: player.textChannel }).catch(err => { });
        if (!data)
            return;
        for (let i = 0; i < data.length; i++) {
            const msg = await Channel.messages?.fetch(data[i].MessageID).catch(() => { });
            if (msg && msg.editable)
                await msg.edit({ components: [button_js_1.buttonDisable] });
            await data[i].delete();
        }
        if (Channel.type !== discord_js_1.ChannelType.GuildText)
            return;
        if (!Channel.guild?.members.me?.permissionsIn(Channel).has(discord_js_1.PermissionFlagsBits.SendMessages))
            return;
        const leaveEmbed = new discord_js_1.EmbedBuilder()
            .setColor(client.data.color)
            .setAuthor({ name: "Queue has ended! No more music to play...", iconURL: client.user?.displayAvatarURL() });
        const settings = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setLabel("Invite Me")
            .setURL(client.data.links.invite)
            .setEmoji(emojis_js_1.default.link)
            .setStyle(discord_js_1.ButtonStyle.Link), new discord_js_1.ButtonBuilder()
            .setLabel("Vote Me")
            .setURL(client.data.topgg.vote)
            .setEmoji(emojis_js_1.default.topgg)
            .setStyle(discord_js_1.ButtonStyle.Link));
        const cdata = await musicchannel_js_1.default.findOne({ Guild: player.guild, Channel: player.textChannel });
        if (!cdata)
            await Channel.send({
                embeds: [leaveEmbed],
                components: [settings]
            }).catch(() => { });
        player.disconnect();
        player.destroy();
        const setupUpdateEmbed = new discord_js_1.EmbedBuilder()
            .setColor(client.data.color)
            .setTitle(`No song playing currently`)
            .setImage(client.data.links.background)
            .setDescription(`**[Invite Me](${client.data.links.invite})  :  [Support Server](${client.data.links.support})  :  [Vote Me](${client.data.topgg.vote})**`);
        await (0, index_js_1.musicSetupUpdate)(client, player, musicchannel_js_1.default, setupUpdateEmbed);
    }
});
