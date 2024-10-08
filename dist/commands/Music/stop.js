"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const structure_1 = require("../../structure");
const tempbutton_1 = __importDefault(require("../../schemas/tempbutton"));
const musicchannel_1 = __importDefault(require("../../schemas/musicchannel"));
const button_1 = require("../../systems/button");
exports.default = new structure_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the current track'),
    category: "Music",
    async execute(interaction, client) {
        if (await (0, structure_1.memberVoice)(interaction))
            return;
        if (await (0, structure_1.botVC)(interaction))
            return;
        if (await (0, structure_1.differentVoice)(interaction))
            return;
        const player = client.player.players.get(interaction.guild?.id);
        if (!player)
            return (0, structure_1.reply)(interaction, "❌", "No song player was found", true);
        await interaction.deferReply();
        const Channel = await interaction.guild?.channels.fetch(player.textChannel);
        if (!Channel)
            return (0, structure_1.reply)(interaction, "❌", "Failed to stop the track", true);
        const data = await tempbutton_1.default.find({ Guild: player.guild, Channel: player.textChannel });
        for (let i = 0; i < data.length; i++) {
            const msg = await Channel.messages.fetch(data[i].MessageID);
            if (msg && msg.editable)
                await msg.edit({ components: [button_1.buttonDisable] });
            await data[i].delete();
        }
        player.disconnect();
        player.destroy();
        const setupUpdateEmbed = new discord_js_1.EmbedBuilder()
            .setColor(client.data.color)
            .setTitle(`No song playing currently`)
            .setImage(client.data.links.background)
            .setDescription(`**[Invite Me](${client.data.links.invite})  :  [Support Server](${client.data.links.support})  :  [Vote Me](${client.data.topgg.vote})**`);
        await (0, structure_1.musicSetupUpdate)(client, player, musicchannel_1.default, setupUpdateEmbed);
        return (0, structure_1.editReply)(interaction, "⏹", "**Stopped** the player");
    }
});
