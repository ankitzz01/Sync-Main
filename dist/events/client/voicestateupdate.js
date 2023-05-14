"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_js_1 = require("../../structure/index.js");
const discord_js_2 = require("discord.js");
const tempbutton_1 = __importDefault(require("../../schemas/tempbutton"));
const button_1 = require("../../systems/button");
exports.default = new index_js_1.Event({
    name: discord_js_1.Events.VoiceStateUpdate,
    async execute(oldState, newState, client) {
        if (oldState.channelId && !newState.channelId) {
            const botVoiceState = oldState.guild.members.me.voice;
            if (!botVoiceState.channel)
                return;
            const player = client.player.players.get(oldState.guild?.id);
            if (!player)
                return;
            if (botVoiceState.channel.members.filter((m) => !m.user.bot).size < 1) {
                const timeout = setTimeout(async () => {
                    player.disconnect();
                    const channel = await oldState.guild.channels.fetch(player.textChannel);
                    player.destroy();
                    if (!channel)
                        return;
                    await channel.send({ embeds: [new discord_js_2.EmbedBuilder()
                                .setAuthor({
                                name: "Left the VC because of inactivity exceeding 5 minutes",
                                iconURL: client.user?.displayAvatarURL()
                            })
                                .setColor(client.data.color)
                        ]
                    }).catch(() => { });
                    const data = await tempbutton_1.default.find({ Guild: player.guild, Channel: player.textChannel });
                    for (let i = 0; i < data.length; i++) {
                        const msg = await channel.messages.fetch(data[i].MessageID);
                        if (msg && msg.editable)
                            await msg.edit({ components: [button_1.buttonDisable] });
                        if (data && data[i])
                            await data[i].delete();
                    }
                }, 1000 * 60 * 5);
                botVoiceState.channel.timeout = timeout;
            }
        }
        if (!oldState.channelId && newState.channelId) {
            const botVoiceState = newState.guild.members.me.voice;
            if (!botVoiceState.channel)
                return;
            if (botVoiceState.channel.id === newState.channelId) {
                if (botVoiceState.channel.timeout) {
                    clearTimeout(botVoiceState.channel.timeout);
                    botVoiceState.channel.timeout = null;
                }
            }
        }
    },
});
