"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_js_1 = require("../../structure/index.js");
const check_js_1 = require("../../structure/functions/check.js");
const promises_1 = __importDefault(require("node:timers/promises"));
const tempbutton_js_1 = __importDefault(require("../../schemas/tempbutton.js"));
const musicchannel_js_1 = __importDefault(require("../../schemas/musicchannel.js"));
const index_js_2 = require("../../structure/index.js");
const button_js_1 = require("../../systems/button.js");
exports.default = new index_js_1.Event({
    name: discord_js_1.Events.InteractionCreate,
    async execute(interaction, client) {
        if (!interaction.isButton())
            return;
        if (!["vol-up", "vol-down", "pause-resume-song", "skip-song", "stop-song"].includes(interaction.customId))
            return;
        if (!interaction.guild)
            return;
        const player = client.player.players.get(interaction.guild?.id);
        if (await (0, check_js_1.memberVoice)(interaction))
            return;
        if (await (0, check_js_1.botVC)(interaction))
            return;
        if (await (0, check_js_1.differentVoice)(interaction))
            return;
        if (!player)
            return interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder()
                        .setColor("DarkRed")
                        .setDescription("No song player was found")
                ], ephemeral: true
            });
        switch (interaction.customId) {
            case "vol-up":
                {
                    const vol = player.volume + 10;
                    if (vol > 100)
                        return interaction.reply({
                            embeds: [new discord_js_1.EmbedBuilder()
                                    .setColor(client.data.color)
                                    .setDescription(`The volume can't be increased further!`)
                            ], ephemeral: true
                        });
                    await interaction.deferReply();
                    player.setVolume(vol);
                    interaction.editReply({
                        embeds: [new discord_js_1.EmbedBuilder()
                                .setColor(client.data.color)
                                .setDescription(`🔊 | The volume has been set to **${player.volume}**`)
                        ]
                    });
                    await promises_1.default.setTimeout(1000);
                    interaction.deleteReply();
                }
                break;
            case "vol-down":
                {
                    const vol = player.volume - 10;
                    if (vol < 0)
                        return interaction.reply({
                            embeds: [new discord_js_1.EmbedBuilder()
                                    .setColor(client.data.color)
                                    .setDescription(`The volume can't be decreased further!`)
                            ], ephemeral: true
                        });
                    await interaction.deferReply();
                    player.setVolume(vol);
                    interaction.editReply({
                        embeds: [new discord_js_1.EmbedBuilder()
                                .setColor(client.data.color)
                                .setDescription(`🔉 | The volume has been set to **${player.volume}**`)
                        ]
                    });
                    await promises_1.default.setTimeout(1000);
                    interaction.deleteReply();
                }
                break;
            case "pause-resume-song":
                {
                    await interaction.deferReply();
                    if (player.paused) {
                        player.pause(false);
                        interaction.editReply({
                            embeds: [new discord_js_1.EmbedBuilder()
                                    .setColor(client.data.color)
                                    .setDescription(`▶ | The player has been **resumed**`)
                            ]
                        });
                        await promises_1.default.setTimeout(1000);
                        interaction.deleteReply();
                    }
                    else {
                        player.pause(true);
                        interaction.editReply({
                            embeds: [new discord_js_1.EmbedBuilder()
                                    .setColor(client.data.color)
                                    .setDescription(`⏸ | The player has been **paused**`)
                            ]
                        });
                        await promises_1.default.setTimeout(1000);
                        interaction.deleteReply();
                    }
                }
                break;
            case "skip-song":
                {
                    await interaction.deferReply();
                    player.stop();
                    interaction.editReply({
                        embeds: [new discord_js_1.EmbedBuilder()
                                .setColor(client.data.color)
                                .setDescription(`⏭ | The current track has been **skipped**`)
                        ]
                    });
                    await promises_1.default.setTimeout(1000);
                    interaction.deleteReply();
                }
                break;
            case "stop-song":
                {
                    await interaction.deferReply();
                    const data = await tempbutton_js_1.default.find({ Guild: player.guild, Channel: player.textChannel }).catch(err => { });
                    if (!player.textChannel)
                        return;
                    const Channel = await client.channels.fetch(player.textChannel).catch(() => { });
                    for (let i = 0; i < data.length; i++) {
                        const msg = await Channel.messages.fetch(data[i].MessageID).catch(() => { });
                        if (msg && msg.editable)
                            await msg.edit({ components: [button_js_1.buttonDisable] });
                        await data[i].delete();
                    }
                    player.disconnect();
                    player.destroy();
                    const setupUpdateEmbed = new discord_js_1.EmbedBuilder()
                        .setColor(client.data.color)
                        .setTitle(`No song playing currently`)
                        .setImage(client.data.links.background)
                        .setDescription(`**[Invite Me](${client.data.links.invite})  :  [Support Server](${client.data.links.support})  :  [Vote Me](${client.data.topgg.vote})**`);
                    await (0, index_js_2.musicSetupUpdate)(client, player, musicchannel_js_1.default, setupUpdateEmbed);
                    interaction.editReply({
                        embeds: [new discord_js_1.EmbedBuilder()
                                .setColor(client.data.color)
                                .setDescription(`⏹ | The player has been **stopped**`)
                        ]
                    });
                    await promises_1.default.setTimeout(1000);
                    interaction.deleteReply();
                }
                break;
        }
    },
});
