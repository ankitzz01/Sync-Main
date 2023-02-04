const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js")
const DB = require("../../Schema/musicChannel")
const emoji = require("../../emojis.json")

async function setupCreate(data, guild, client, interaction) {

    const parent = await guild.channels.create({
        name: `${client.user.username.toLowerCase()} zone`,
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
            {
                type: 0,
                id: guild.roles.cache.find((x) => x.name === "@everyone").id,
                allow: [
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.EmbedLinks,
                ],
            },
            {
                type: 1,
                id: client.user.id,
                allow: [
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.Connect,
                    PermissionFlagsBits.EmbedLinks,
                    PermissionFlagsBits.Speak
                ]
            },
        ],
    })

    const textChannel = await interaction.guild.channels.create({
        name: `🎶 | ${client.user.username}-song-requests`,
        type: ChannelType.GuildText,
        parent: parent.id,
        permissionOverwrites: [
            {
                type: 0,
                id: guild.roles.cache.find((x) => x.name === "@everyone").id,
                allow: [
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.EmbedLinks,
                    PermissionFlagsBits.ReadMessageHistory
                ],
            },
            {
                type: 1,
                id: client.user.id,
                allow: [
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.Connect,
                    PermissionFlagsBits.EmbedLinks,
                    PermissionFlagsBits.Speak
                ]
            },
        ],

    })

    const voiceChannel = await interaction.guild.channels.create({
        name: `${client.user.username}`,
        type: ChannelType.GuildVoice,
        userLimit: 25,
        parent: parent.id,
        permissionOverwrites: [
            {
                type: 0,
                id: guild.roles.cache.find((x) => x.name === "@everyone").id,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.Connect,
                ],
                deny: [
                    PermissionFlagsBits.Speak
                ]
            },
            {
                type: 1,
                id: client.user.id,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.Connect,
                    PermissionFlagsBits.Speak
                ]
            },

        ],

    })

    let title
    let image

    const player = client.player.players.get(interaction.guild.id)

    if (player && player.playing && player.queue.current) {
        title = player.queue.current.title
        image = player.queue.current.displayThumbnail("maxresdefault")
    } else {
        title = `No song playing currently`
        image = client.config.panelImage
    }

    let mainEmbed = new EmbedBuilder()
        .setColor(client.color)
        .setTitle(`${title}`)
        .setImage(`${image}`)
        .setDescription(
            `**[Invite Me](${client.config.invite})  :  [Support Server](${client.config.support})  :  [Vote Me](${client.config.topgg})**`
        )

    let mainComponents = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("vol-down")
            .setEmoji(emoji.button.voldown)
            .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
            .setCustomId("pause-resume-song")
            .setEmoji(emoji.button.pauseresume)
            .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
            .setCustomId("stop-song")
            .setEmoji(emoji.button.stop)
            .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
            .setCustomId("skip-song")
            .setEmoji(emoji.button.skip)
            .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
            .setCustomId("vol-up")
            .setEmoji(emoji.button.volup)
            .setStyle(ButtonStyle.Secondary),)

    const panel = await textChannel.send({
        embeds: [mainEmbed],
        components: [mainComponents]
    })

    data = new DB({
        Guild: interaction.guild.id,
        Channel: textChannel.id,
        VoiceChannel: voiceChannel.id,
        Message: panel.id
    })

    await data.save()
}

module.exports = {
    category: "Others",
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Setup the sync music requesting channel")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(sub =>
            sub.setName('create').setDescription('Setup the music channel')
        )
        .addSubcommand(sub =>
            sub.setName('delete').setDescription('Delete the current music channel')
        )
        .addSubcommand(sub =>
            sub.setName('info').setDescription('Check the current status of the music setup')
        ),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        const sub = interaction.options.getSubcommand()

        const errEmbed = new EmbedBuilder()
            .setColor("DarkRed")

        const guild = interaction.guild

        if (!guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({
            embeds: [errEmbed.setDescription(`Missing permissions for \`ManageChannels\`.`)], ephemeral: true
        })

        let data = await DB.findOne({ Guild: interaction.guild.id })

        switch (sub) {
            case "create": {

                if (data) {
                    const channel = guild.channels.cache.get(data.Channel)

                    if (!channel) {
                        await data.delete()

                        setupCreate(data, guild, client, interaction)
                    }

                    else return interaction.reply({
                        embeds: [errEmbed.setDescription(`The music channel is already set on <#${channel.id}>`)], ephemeral: true
                    })

                } else {

                    setupCreate(data, guild, client, interaction)

                }

            }

                break;

            case "delete": {

                if (!data) return interaction.reply({
                    embeds: [errEmbed.setDescription(`No music setup found for this server`)], ephemeral: true
                })

                await data.delete()

                interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`Successfully deleted the music setup from this server`)
                    ]
                })

                try {
                    const channel = guild.channels.cache.get(data.Channel)
                    const vc = guild.channels.cache.get(data.VoiceChannel)

                    if (!channel && !vc) return

                    let parent

                    if (channel && !vc) parent = channel.parent
                    else if (vc && !channel) parent = vc.parent
                    else parent = channel.parent

                    if (channel.deletable) await channel.delete()
                    if (vc.deletable) await vc.delete()
                    if (parent.deletable) await parent.delete()

                } catch (error) { }

            }
                break;
        }
    }

}