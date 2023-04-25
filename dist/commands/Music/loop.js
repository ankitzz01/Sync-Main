"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const structure_1 = require("../../structure");
exports.default = new structure_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName('loop')
        .setDescription('Loop the current song or queue')
        .addStringOption(opt => opt.setName('mode')
        .setDescription('Configure the loop settings')
        .setRequired(true)
        .addChoices({
        name: "Track",
        value: "song"
    }, {
        name: "Queue",
        value: "playlist"
    }, {
        name: "Disable",
        value: "off"
    })),
    category: "Music",
    async execute(interaction, client) {
        const { options } = interaction;
        const player = client.player.players.get(interaction.guild?.id);
        if (await (0, structure_1.memberVoice)(interaction))
            return;
        if (await (0, structure_1.botVC)(interaction))
            return;
        if (await (0, structure_1.differentVoice)(interaction))
            return;
        if (!player)
            return interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder()
                        .setColor("DarkRed")
                        .setDescription("No song player was found")
                ], ephemeral: true
            });
        const choice = options.getString("mode");
        if (choice == "song") {
            if (player.trackRepeat)
                return interaction.reply({
                    embeds: [new discord_js_1.EmbedBuilder()
                            .setColor("DarkRed")
                            .setDescription(`This song is already being looped`)
                    ], ephemeral: true
                });
            if (player.queueRepeat)
                return interaction.reply({
                    embeds: [new discord_js_1.EmbedBuilder()
                            .setColor("DarkRed")
                            .setDescription(`The queue is already being looped`)
                    ], ephemeral: true
                });
            await interaction.deferReply();
            player.setTrackRepeat(true);
            return interaction.editReply({
                embeds: [new discord_js_1.EmbedBuilder()
                        .setColor(client.data.color)
                        .setDescription(`🔄 | **Looping** the current track`)
                ]
            });
        }
        if (choice == "playlist") {
            if (player.trackRepeat)
                return interaction.reply({
                    embeds: [new discord_js_1.EmbedBuilder()
                            .setColor("DarkRed")
                            .setDescription(`This song is already being looped`)
                    ], ephemeral: true
                });
            if (player.queueRepeat)
                return interaction.reply({
                    embeds: [new discord_js_1.EmbedBuilder()
                            .setColor("DarkRed")
                            .setDescription(`The queue is already being looped`)
                    ], ephemeral: true
                });
            await interaction.deferReply();
            player.setQueueRepeat(true);
            return interaction.editReply({
                embeds: [new discord_js_1.EmbedBuilder()
                        .setColor(client.data.color)
                        .setDescription(`🔄 | Looping the queue`)
                ]
            });
        }
        if (choice == "off") {
            if (!player.trackRepeat && !player.queueRepeat)
                return interaction.reply({
                    embeds: [new discord_js_1.EmbedBuilder()
                            .setColor("DarkRed")
                            .setDescription(`The loop mode is already disabled`)
                    ], ephemeral: true
                });
            await interaction.deferReply();
            player.setTrackRepeat(false);
            player.setQueueRepeat(false);
            return interaction.editReply({
                embeds: [new discord_js_1.EmbedBuilder()
                        .setColor(client.data.color)
                        .setDescription(`✅ | The loop mode has been disabled`)
                ]
            });
        }
    }
});
