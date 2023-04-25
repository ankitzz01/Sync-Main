"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const playlist_1 = __importDefault(require("../../schemas/playlist"));
const promises_1 = __importDefault(require("node:timers/promises"));
const structure_1 = require("../../structure");
exports.default = new structure_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName("playlist")
        .setDescription("Create and manage your own music playlist")
        .addSubcommand(sub => sub.setName('create')
        .setDescription('Create a music playlist')
        .addStringOption(opt => opt.setName('name')
        .setDescription('Enter the name for your playlist')
        .setRequired(true)
        .setMinLength(2)
        .setMaxLength(10))
        .addStringOption(opt => opt.setName("privacy")
        .setDescription('Select the privacy of your playlist')
        .setRequired(true)
        .addChoices({ name: "Private", value: "private" }, { name: "Public", value: "public" })))
        .addSubcommand(sub => sub.setName('delete')
        .setDescription('Delete a playlist')
        .addStringOption(opt => opt.setName('playlist')
        .setDescription('Enter the name of the playlist')
        .setRequired(true)
        .setMaxLength(24)
        .setMinLength(2)
        .setAutocomplete(true)))
        .addSubcommand(sub => sub.setName('info')
        .setDescription('Shows info about your playlist')
        .addStringOption(opt => opt.setName('playlist')
        .setDescription('Enter the name of the playlist')
        .setRequired(true)
        .setMaxLength(10)
        .setMinLength(2)
        .setAutocomplete(true)))
        .addSubcommand(sub => sub.setName('list')
        .setDescription('Shows all of your created playlist'))
        .addSubcommand(sub => sub.setName('play')
        .setDescription('Play songs from your playlist')
        .addStringOption(opt => opt.setName('playlist')
        .setDescription('Enter the playlist name to play')
        .setRequired(true)
        .setAutocomplete(true)))
        .addSubcommand(sub => sub.setName('add')
        .setDescription('Add a song to your playlist')
        .addStringOption(opt => opt.setName('song')
        .setDescription('Enter the song name or URL to add')
        .setRequired(true))
        .addStringOption(opt => opt.setName('playlist')
        .setDescription('Enter the playlist name')
        .setRequired(true)
        .setMaxLength(10)
        .setMinLength(2)
        .setAutocomplete(true)))
        .addSubcommand(sub => sub.setName('remove')
        .setDescription('Remove a song from your playlist')
        .addStringOption(opt => opt.setName('playlist')
        .setDescription('Enter the playlist name')
        .setRequired(true)
        .setMaxLength(10)
        .setMinLength(2)
        .setAutocomplete(true))
        .addIntegerOption(opt => opt.setName('position')
        .setDescription('Enter the position of the song')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(20)))
        .addSubcommand(sub => sub.setName('current')
        .setDescription('Save the current playing song to your playlist')
        .addStringOption(opt => opt.setName('playlist')
        .setDescription('Enter the playlist name')
        .setRequired(true)
        .setMaxLength(10)
        .setMinLength(2)
        .setAutocomplete(true))),
    category: "Playlist",
    async execute(interaction, client) {
        let data = await playlist_1.default.findOne({ User: interaction.user.id });
        const errEmbed = new discord_js_1.EmbedBuilder()
            .setColor("DarkRed");
        const succEmbed = new discord_js_1.EmbedBuilder()
            .setColor(client.data.color);
        switch (interaction.options.getSubcommand()) {
            case "create":
                {
                    const name = interaction.options.getString('name', true).toUpperCase();
                    const Playlist = interaction.options.getString('privacy', true) === 'private' ? true : false;
                    await interaction.deferReply({ ephemeral: true });
                    if (data) {
                        if (data.Playlist.length >= 3)
                            return interaction.editReply({
                                embeds: [errEmbed.setDescription(`\`❌\` | You can only create a maximum of 3 playlist`)]
                            });
                        for (const playlist of data.Playlist) {
                            if (playlist.name == name) {
                                return interaction.editReply({
                                    embeds: [errEmbed.setDescription(`\`❌\` | A playlist already exists with that name`)]
                                });
                            }
                        }
                        const newPlaylist = {
                            name: name,
                            songs: [],
                            private: Playlist,
                            created: Math.round(Date.now() / 1000)
                        };
                        data.Playlist.push(newPlaylist);
                        await data.save();
                        interaction.editReply({
                            embeds: [succEmbed.setDescription(`\`✅\` Created a playlist with the name **${name}**`)]
                        });
                    }
                    else {
                        data = new playlist_1.default({
                            User: interaction.user.id,
                            Playlist: [{ name: name, songs: [], private: Playlist, created: Math.round(Date.now() / 1000) }]
                        });
                        await data.save();
                        interaction.editReply({
                            embeds: [succEmbed.setDescription(`\`✅\` Created a playlist with the name **${name}**`)]
                        });
                    }
                }
                break;
            case "delete":
                {
                    await interaction.deferReply({ ephemeral: true });
                    const playlist = interaction.options.getString('playlist', true).toUpperCase();
                    if (!data || data.Playlist.length == 0)
                        return interaction.editReply({
                            embeds: [errEmbed.setDescription(`\`❌\` | You have no playlist created`)]
                        });
                    let index = data.Playlist.findIndex(x => x.name === playlist);
                    if (index == -1)
                        return interaction.editReply({
                            embeds: [errEmbed.setDescription(`\`❌\` | No playlist found with that name`)]
                        });
                    data.Playlist.splice(index, 1);
                    await data.save();
                    interaction.editReply({
                        embeds: [succEmbed.setDescription(`\`✅\` | Deleted the playlist`)]
                    });
                }
                break;
            case "info":
                {
                    const playlist = interaction.options.getString('playlist', true).toUpperCase();
                    for (const list of data.Playlist) {
                        if (list.name === playlist) {
                            if (list.songs.length === 0)
                                return interaction.reply({
                                    embeds: [
                                        errEmbed.setDescription(`\`❌\` | The playlist is empty. Use \`/playlist add\` to add new songs`)
                                    ], ephemeral: true
                                });
                            const Sorted = list.songs;
                            const embeds = animate(Sorted, 5, list.name.toUpperCase());
                            (0, structure_1.paginate)(interaction, embeds);
                            return;
                        }
                    }
                    interaction.reply({
                        embeds: [errEmbed.setDescription(`\`❌\` | No playlist found named **${playlist}**`)], ephemeral: true
                    });
                    function animate(pages, number, playlistName) {
                        const Embeds = [];
                        let k = number;
                        for (let i = 0; i < pages.length; i += number) {
                            const current = pages.slice(i, k);
                            k += number;
                            const MappedData = current.map(value => `• ${value.toUpperCase()}`).join("\n");
                            const Embed = new discord_js_1.EmbedBuilder()
                                .setTitle(`__${playlistName}__ (${pages.length} / 20 Songs)`)
                                .setColor(client.data.color)
                                .setThumbnail(`${interaction.user.displayAvatarURL()}`)
                                .setFooter({ text: `${pages.length} / 20`, iconURL: interaction.guild?.iconURL() })
                                .setDescription(`\`\`\`${MappedData}\`\`\``);
                            Embeds.push(Embed);
                        }
                        return Embeds;
                    }
                }
                break;
            case "list":
                {
                    if (!data || data.Playlist.length == 0)
                        return interaction.reply({
                            embeds: [errEmbed.setDescription(`\`❌\` | You have no playlist`)], ephemeral: true
                        });
                    await interaction.deferReply();
                    let info1 = ``, info2 = ``, info3 = ``;
                    if (data.Playlist[0]) {
                        info1 = `
                    __**${data.Playlist[0].name}**__\
                    \n> **Total Songs: ${data.Playlist[0].songs.length} / 20\
                    \n> Privacy: ${data.Playlist[0].private === true ? `Private` : `Public`}\
                    \n> Created On: **<t:${data.Playlist[0].created}>`;
                    }
                    if (data.Playlist[1]) {
                        info2 = `
                    __**${data.Playlist[1].name}**__\
                    \n> **Total Songs: ${data.Playlist[1].songs.length} / 20\
                    \n> Privacy: ${data.Playlist[1].private === true ? `Private` : `Public`}\
                    \n> Created On: **<t:${data.Playlist[1].created}>`;
                    }
                    if (data.Playlist[2]) {
                        info3 = `
                    __**${data.Playlist[2].name}**__\
                    \n> **Total Songs: ${data.Playlist[2].songs.length} / 20\
                    \n> Privacy: ${data.Playlist[2].private === true ? `Private` : `Public`}\
                    \n> Created On: **<t:${data.Playlist[2].created}>`;
                    }
                    const List = new discord_js_1.EmbedBuilder()
                        .setColor(client.data.color)
                        .setAuthor({ name: `${interaction.user.username} Playlist(s)`, iconURL: interaction.user.displayAvatarURL() })
                        .setDescription(`${info1}\n${info2}\n${info3}`)
                        .setThumbnail(interaction.user.displayAvatarURL())
                        .setFooter({ text: `Playlist ${data.Playlist.length} / 3` });
                    interaction.editReply({
                        embeds: [List]
                    });
                }
                break;
            case "play":
                {
                    if (await (0, structure_1.memberVoice)(interaction))
                        return;
                    if (await (0, structure_1.joinable)(interaction))
                        return;
                    if (await (0, structure_1.differentVoice)(interaction))
                        return;
                    if (await (0, structure_1.stageCheck)(interaction))
                        return;
                    await interaction.deferReply();
                    if (!data || data.Playlist.length === 0)
                        return interaction.editReply({
                            embeds: [errEmbed.setDescription(`\`❌\` | You have no playlist created. Use \`/playlist create\` to create one`)]
                        });
                    const playlist = interaction.options.getString('playlist', true).toUpperCase();
                    for (const list of data.Playlist) {
                        if (list.name === playlist) {
                            if (list.songs.length === 0)
                                return interaction.editReply({
                                    embeds: [errEmbed.setDescription(`\`❌\` | The playlist is empty. Use \`/playlist add\` to add new songs`)]
                                });
                            const player = client.player.create({
                                guild: interaction.guild?.id,
                                voiceChannel: interaction.member.voice.channel?.id,
                                textChannel: interaction.channel?.id,
                                selfDeafen: true
                            });
                            for (const song of list.songs) {
                                (0, structure_1.playSong)(interaction, client, player, song);
                                await promises_1.default.setTimeout(1200);
                            }
                            return;
                        }
                    }
                    interaction.editReply({
                        embeds: [errEmbed.setDescription(`\`❌\` | No playlist found named **${playlist}**`)]
                    });
                }
                break;
            case "add":
                {
                    await interaction.deferReply({ ephemeral: true });
                    if (!data || data.Playlist.length == 0)
                        return interaction.editReply({
                            embeds: [errEmbed.setDescription(`\`❌\` | You have no playlist created. Use \`/playlist create\` to create one`)]
                        });
                    const playlist = interaction.options.getString('playlist', true).toUpperCase();
                    const song = interaction.options.getString('song', true);
                    for (const list of data.Playlist) {
                        if (list.name === playlist) {
                            if (list.songs.length >= 20)
                                return interaction.editReply({
                                    embeds: [errEmbed.setDescription(`\`❌\` | Maximum of 20 songs can be added`)]
                                });
                            list.songs.push(song);
                            await data.save();
                            return interaction.editReply({
                                embeds: [succEmbed.setDescription(`\`✅\` | Added the song to **${playlist}** `)]
                            });
                        }
                    }
                    interaction.editReply({
                        embeds: [errEmbed.setDescription(`\`❌\` | No playlist found named **${playlist}**`)]
                    });
                }
                break;
            case "remove":
                {
                    await interaction.deferReply({ ephemeral: true });
                    const playlist = interaction.options.getString('playlist', true).toUpperCase();
                    const position = interaction.options.getInteger('position', true);
                    for (const list of data.Playlist) {
                        if (list.name === playlist) {
                            if (list.songs.length === 0)
                                return interaction.editReply({
                                    embeds: [
                                        errEmbed.setDescription(`\`❌\` | The playlist is empty. Use \`/playlist add\` to add new songs`)
                                    ]
                                });
                            list.songs.splice(Number(position) - 1, 1);
                            await data.save();
                            return interaction.editReply({
                                embeds: [succEmbed.setDescription(`\`✅\` | Removed the song at position ${Number(position)}`)]
                            });
                        }
                    }
                    interaction.editReply({
                        embeds: [errEmbed.setDescription(`\`❌\` | No playlist found named **${playlist}**`)]
                    });
                }
                break;
            case "current":
                {
                    await interaction.deferReply({ ephemeral: true });
                    if (!data || data.Playlist.length == 0)
                        return interaction.editReply({
                            embeds: [errEmbed.setDescription(`\`❌\` | You have no playlist created. Use \`/playlist create\` to create one`)]
                        });
                    const playlist = interaction.options.getString('playlist', true).toUpperCase();
                    const player = client.player.players.get(interaction.guild?.id);
                    if (!player)
                        return interaction.editReply({
                            embeds: [new discord_js_1.EmbedBuilder()
                                    .setColor("DarkRed")
                                    .setDescription("No song player was found")
                            ]
                        });
                    if (!(player.playing || player.paused || player.queue.current))
                        return interaction.editReply({
                            embeds: [new discord_js_1.EmbedBuilder()
                                    .setColor("DarkRed")
                                    .setDescription("No song was found playing")
                            ]
                        });
                    const track = player.queue.current;
                    for (const list of data.Playlist) {
                        if (list.name === playlist) {
                            if (list.songs.length >= 20)
                                return interaction.editReply({
                                    embeds: [errEmbed.setDescription(`\`❌\` | Maximum of 20 songs can be added`)]
                                });
                            list.songs.push(track?.uri);
                            await data.save();
                            return interaction.editReply({
                                embeds: [succEmbed.setDescription(`\`✅\` | Added the song to **${playlist}**`)]
                            });
                        }
                    }
                    interaction.editReply({
                        embeds: [errEmbed.setDescription(`\`❌\` | No playlist found named **${playlist}**`)]
                    });
                }
                break;
        }
    }
});
