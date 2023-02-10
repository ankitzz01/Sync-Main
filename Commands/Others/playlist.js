const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const DB = require("../../Schema/playlist")
const convert = require("youtube-timestamp")
const check = require("../../Functions/check")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playlist")
        .setDescription("Create and manage your own music playlist")
        .addSubcommand(sub =>
            sub.setName('create')
                .setDescription('Create a music playlist')
                .addStringOption(opt =>
                    opt.setName('name')
                        .setDescription('Enter the name for your playlist')
                        .setRequired(true)
                        .setMinLength(2)
                        .setMaxLength(10)
                )
                .addStringOption(opt =>
                    opt.setName("privacy")
                        .setDescription('Select the privacy of your playlist')
                        .setRequired(true)
                        .addChoices(
                            { name: "Private", value: "private" },
                            { name: "Public", value: "public" }
                        ))
        )
        .addSubcommand(sub =>
            sub.setName('delete')
                .setDescription('Delete a playlist')
                .addStringOption(opt =>
                    opt.setName('playlist')
                        .setDescription('Enter the name of the playlist')
                        .setRequired(true)
                        .setMaxLength(24)
                        .setMinLength(2)
                )
        )
        .addSubcommand(sub =>
            sub.setName('info')
                .setDescription('Shows info about your playlist')
                .addStringOption(opt =>
                    opt.setName('playlist')
                        .setDescription('Enter the name of the playlist')
                        .setRequired(true)
                        .setMaxLength(10)
                        .setMinLength(2)
                )
        )
        .addSubcommand(sub =>
            sub.setName('list')
                .setDescription('Shows all of your created playlist')
        )
        .addSubcommand(sub =>
            sub.setName('play')
                .setDescription('Play your playlist')
                .addStringOption(opt =>
                    opt.setName('playlist')
                        .setDescription('Enter the playlist name to play')
                        .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub.setName('add')
                .setDescription('Add a song to your playlist')
                .addStringOption(opt =>
                    opt.setName('song')
                        .setDescription('Enter the song name or URL to add')
                        .setRequired(true)
                )
                .addStringOption(opt =>
                    opt.setName('playlist')
                        .setDescription('Enter the playlist name')
                        .setRequired(true)
                        .setMaxLength(10)
                        .setMinLength(2)
                )
        )
        .addSubcommand(sub =>
            sub.setName('remove')
                .setDescription('Remove a song from your playlist')
                .addStringOption(opt =>
                    opt.setName('song')
                        .setDescription('Enter the position of the song')
                        .setRequired(true)
                )
                .addStringOption(opt =>
                    opt.setName('playlist')
                        .setDescription('Enter the playlist name')
                        .setRequired(true)
                        .setMaxLength(10)
                        .setMinLength(2)
                )
        )
        .addSubcommand(sub =>
            sub.setName('current')
                .setDescription('Save the current playing song to your playlist')
                .addStringOption(opt =>
                    opt.setName('playlist')
                        .setDescription('Enter the playlist name')
                        .setRequired(true)
                        .setMaxLength(10)
                        .setMinLength(2)
                )
                ),
    category: "Others",

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        let data = await DB.findOne({ User: interaction.user.id })

        const errEmbed = new EmbedBuilder()
            .setColor("DarkRed")

        const succEmbed = new EmbedBuilder()
            .setColor(client.color)

        switch (interaction.options.getSubcommand()) {

            case "create": {

                const name = interaction.options.getString('name').toUpperCase()

                const private = interaction.options.getString('privacy') === 'private' ? true : false

                await interaction.deferReply({ ephemeral: true })

                if (data) {

                    if (data.Playlist.length >= 3) return interaction.reply({
                        embeds: [errEmbed.setDescription(`\`❌\` | You can only create a maximum of 3 playlist`)]
                    })

                    if (data.Playlist.forEach(x => x.name === name)) return interaction.reply({
                        embeds: [errEmbed.setDescription(`\`❌\` | A playlist already exists with that name`)]
                    })

                    const newPlaylist = {
                        name: name,
                        songs: [],
                        private: private,
                        created: Math.round(Date.now() / 1000)
                    }

                    data.Playlist.push(newPlaylist)

                    await data.save()

                    interaction.editReply({
                        embeds: [succEmbed.setDescription(`\`✅\` Created a playlist with the name **${name}**`)]
                    })

                } else {

                    data = new DB({
                        User: interaction.user.id,
                        Playlist: [{ name: name, songs: [], private: private, created: Math.round(Date.now() / 1000) }]
                    })

                    await data.save()

                    interaction.editReply({
                        embeds: [succEmbed.setDescription(`\`✅\` Created a playlist with the name **${name}**`)]
                    })

                }

            }
                break;

            case "delete": {

                await interaction.deferReply({ ephemeral: true })

                const playlist = interaction.options.getString('playlist').toUpperCase()

                if (!data) return interaction.editReply({
                    embeds: [errEmbed.setDescription(`\`❌\` | You have no playlist created`)]
                })

                let index = data.Playlist.findIndex(x => x.name === playlist)

                if (index == -1) return interaction.editReply({
                    embeds: [errEmbed.setDescription(`\`❌\` | No playlist found with that name`)]
                })

                data.Playlist.splice(index, 1)

                await data.save()

                interaction.editReply({
                    embeds: [succEmbed.setDescription(`\`✅\` | Deleted the playlist`)]
                })

            }
                break;

            case "info": {

            }
                break;

            case "list": {

                await interaction.deferReply()

                if (!data) return interaction.reply({
                    embeds: [errEmbed.setDescription(`\`❌\` | You have no playlist`)], ephemeral: true
                })

                if (!data.Playlist.length) return interaction.reply({
                    embeds: [errEmbed.setDescription(`\`❌\` | You have no playlist`)], ephemeral: true
                })

                let info1 = ``, info2 = ``, info3 = ``

                if (data.Playlist[0]) {

                    info1 = `
                    __**${data.Playlist[0].name}**__\
                    \n\`\`\`> Total Songs: ${data.Playlist[0].songs.length} / 15\
                    \n> Privacy: ${data.Playlist[0].private === true ? `Private` : `Public`}\
                    \n> Created On: <t:${data.Playlist[0].created}>\`\`\``

                }
                if (data.Playlist[1]) {

                    info2 = `
                    __**${data.Playlist[1].name}**__\
                    \n\`\`\`> Total Songs: ${data.Playlist[1].songs.length} / 15\
                    \n> Privacy: ${data.Playlist[1].private === true ? `Private` : `Public`}\
                    \n> Created On: <t:${data.Playlist[1].created}>\`\`\``
                }
                if (data.Playlist[2]) {

                    info3 = `
                    __**${data.Playlist[2].name}**__\
                    \n\`\`\`> Total Songs: ${data.Playlist[2].songs.length} / 15\
                    \n> Privacy: ${data.Playlist[2].private === true ? `Private` : `Public`}\
                    \n> Created On: <t:${data.Playlist[2].created}>\`\`\``

                }

                const List = new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                    .setDescription(`${info1}\n${info2}\n${info3}`)
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setFooter({ text: `Playlist ${data.Playlist.length} / 3` })

                interaction.editReply({
                    embeds: [List]
                })

            }
                break;

            case "play": {

                if (await check.memberVoice(interaction)) return
                if (await check.joinable(interaction)) return
                if (await check.differentVoice(interaction)) return
                if (await check.stageCheck(interaction)) return

                await interaction.deferReply()

                if (!data || !data.Playlist.length) return interaction.editReply({
                    embeds: [errEmbed.setDescription(`\`❌\` | You have no playlist created. Use \`/playlist create\` to create one`)]
                })

                const playlist = interaction.options.getString('playlist').toUpperCase()

                for (const list of data.Playlist) {

                    if (list.name === playlist) {

                        if (!list.songs.length) return interaction.editReply({
                            embeds: [errEmbed.setDescription(`\`❌\` | The playlist is empty. Use \`/playlist add\` to add new songs`)]
                        })

                        const player = await client.player.create({
                            guild: interaction.guild.id,
                            voiceChannel: interaction.member.voice.channel.id,
                            textChannel: interaction.channel.id,
                            selfDeafen: true
                        })

                        let res

                        if (player.state !== "CONNECTED") await player.connect()

                        for (const song of list.songs) {

                            try {
                                res = await player.search(song, interaction.user)

                                if (res.loadType === "LOAD_FAILED") {

                                    if (!player.queue.current) await player.destroy()
                                    return interaction.editReply({
                                        embeds: [new EmbedBuilder()
                                            .setColor("DarkRed")
                                            .setDescription(`An error has occured!`)
                                        ]
                                    })

                                } else if (res.loadType === "NO_MATCHES") {
                                    if (!player.queue.current) await player.destroy()
                                    return interaction.editReply({
                                        embeds: [new EmbedBuilder()
                                            .setColor("DarkRed")
                                            .setDescription(`No result found for the query`)
                                        ]
                                    })
                                } else if (res.loadType === "PLAYLIST_LOADED") {

                                    player.queue.add(res.tracks)
                                    if (!player.playing && !player.paused && !player.queue.size) await player.play()

                                    let link = `https://www.google.com/search?q=${encodeURIComponent(res.tracks[0].title)}`

                                    return interaction.editReply({
                                        embeds: [new EmbedBuilder()
                                            .setColor(client.color)
                                            .setAuthor({ name: "ADDED TO QUEUE", iconURL: interaction.user.displayAvatarURL(), url: client.config.invite })
                                            .setDescription(`[\`\`${res.tracks[0].title}\`\`](${link})\n\nAdded by: ${interaction.user} | Duration: \`❯ ${convert(res.tracks[0].duration)}\``)
                                        ]
                                    })

                                } else if (["TRACK_LOADED", "SEARCH_RESULT"].includes(res.loadType)) {

                                    let link = `https://www.google.com/search?q=${encodeURIComponent(res.tracks[0].title)}`

                                    player.queue.add(res.tracks[0])
                                    if (!player.playing && !player.paused && !player.queue.size) await player.play()

                                    return interaction.editReply({
                                        embeds: [new EmbedBuilder()
                                            .setColor(client.color)
                                            .setAuthor({ name: "ADDED TO QUEUE", iconURL: interaction.user.displayAvatarURL(), url: client.config.invite })
                                            .setDescription(`[\`\`${res.tracks[0].title}\`\`](${link})\n\n**Added by: ${interaction.user} | Duration: **\`\`❯ ${convert(res.tracks[0].duration)}\`\``)
                                        ]
                                    })
                                }
                            } catch (error) {
                                interaction.editReply({
                                    embeds: [new EmbedBuilder()
                                        .setColor("DarkRed")
                                        .setDescription(`An error has occured!`)
                                    ]
                                })
                        
                                console.log(error)
                            }

                        }

                    } else return interaction.editReply({
                        embeds: [errEmbed.setDescription(`\`❌\` | No playlist found named **${playlist}**`)]
                    })

                }

            }
                break;

            case "add": {

                await interaction.deferReply({ ephemeral: true })

                if (!data || !data.Playlist.length) return interaction.editReply({
                    embeds: [errEmbed.setDescription(`\`❌\` | You have no playlist created. Use \`/playlist create\` to create one`)]
                })

                const playlist = interaction.options.getString('playlist').toUpperCase()
                const song = interaction.options.getString('song')

                for (const list of data.Playlist) {

                    if (list.name === playlist) {

                        list.songs.push(song)

                        await data.save()

                        return interaction.editReply({
                            embeds: [succEmbed.setDescription(`\`✅\` | Added the song to ${playlist} `)]
                        })

                    } else return interaction.editReply({
                        embeds: [errEmbed.setDescription(`\`❌\` | No playlist found named **${playlist}**`)]
                    })

                }

            }
                break;

            case "remove": {

            }
                break;

            case "current": {

                await interaction.deferReply({ ephemeral: true })

                if (!data || !data.Playlist.length) return interaction.editReply({
                    embeds: [errEmbed.setDescription(`\`❌\` | You have no playlist created. Use \`/playlist create\` to create one`)]
                })

                const playlist = interaction.options.getString('playlist').toUpperCase()

                const player = client.player.players.get(interaction.guild.id)

                if (!player) return interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setColor("DarkRed")
                        .setDescription("No song player was found")
                    ]
                })

                if (!(player.playing || player.paused || player.queue.current)) return interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setColor("DarkRed")
                        .setDescription("No song was found playing")
                    ]
                })

                const track = player.queue.current

                for (const list of data.Playlist) {

                    if (list.name === playlist) {

                        list.songs.push(track.uri)

                        await data.save()

                        return interaction.editReply({
                            embeds: [succEmbed.setDescription(`\`✅\` | Added the song to ${playlist} `)]
                        })

                    } else return interaction.editReply({
                        embeds: [errEmbed.setDescription(`\`❌\` | No playlist found named **${playlist}**`)]
                    })

                }

            }
                break;
        }

    }

}