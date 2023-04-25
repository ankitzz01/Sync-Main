import { CustomClient, SlashCommand } from "../../structure"
import { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits, Guild, ChatInputCommandInteraction, GuildChannel } from "discord.js"
import DB, { MusicChannelSchema } from "../../schemas/musicchannel"
import { panelbutton } from "../../systems/button"

async function setupCreate(data: MusicChannelSchema, guild: Guild, client: CustomClient, interaction: ChatInputCommandInteraction) {

    const parent = await guild.channels.create({
        name: `${client.user?.username.toLowerCase()} zone`,
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
            {
                type: 0,
                id: guild.roles.cache.find((x) => x.name === "@everyone")?.id as string,
                allow: [
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.EmbedLinks,
                ],
            },
            {
                type: 1,
                id: client.user?.id as string,
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

    const textChannel = await interaction.guild?.channels.create({
        name: `music-request`,
        type: ChannelType.GuildText,
        parent: parent.id,
        permissionOverwrites: [
            {
                type: 0,
                id: guild.roles.cache.find((x) => x.name === "@everyone")?.id as string,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ReadMessageHistory
                ],
                deny: [
                    PermissionFlagsBits.SendMessages,
                ]
            },
            {
                type: 1,
                id: client.user?.id as string,
                allow: [
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.EmbedLinks,
                ]
            },
        ],

    })

    const voiceChannel = await interaction.guild?.channels.create({
        name: `${client.user?.username}`,
        type: ChannelType.GuildVoice,
        userLimit: 25,
        parent: parent.id,
        permissionOverwrites: [
            {
                type: 0,
                id: guild.roles.cache.find((x) => x.name === "@everyone")?.id as string,
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
                id: client.user?.id as string,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.Connect,
                    PermissionFlagsBits.Speak
                ]
            },

        ],

    })

    let title: string
    let image: string

    const player = client.player.players.get(interaction.guild?.id as string)

    if (player && player.playing && player.queue.current) {
        title = player.queue.current.title
        image = player.queue.current.displayThumbnail!("maxresdefault") || client.data.links.background;
    } else {
        title = `No song playing currently`
        image = client.data.links.background
    }

    let mainEmbed = new EmbedBuilder()
        .setColor(client.data.color)
        .setTitle(`${title}`)
        .setImage(`${image}`)
        .setDescription(
            `**[Invite Me](${client.data.links.invite})  :  [Support Server](${client.data.links.support})  :  [Vote Me](${client.data.links.topgg})**`
        )

    const panel = await textChannel?.send({
        embeds: [mainEmbed],
        components: [panelbutton]
    })

    data = new DB({
        Guild: interaction.guild?.id,
        Channel: textChannel?.id,
        VoiceChannel: voiceChannel?.id,
        Message: panel?.id
    })

    await data.save()
}

export default new SlashCommand({
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
    category: "Others",

    async execute(interaction, client) {

        const sub = interaction.options.getSubcommand()

        const errEmbed = new EmbedBuilder()
            .setColor("DarkRed")

        const guild = interaction.guild

        if (!guild?.members.me?.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({
            embeds: [errEmbed.setDescription(`Missing permissions for \`ManageChannels\`.`)], ephemeral: true
        })

        let data = await DB.findOne({ Guild: interaction.guild?.id })

        switch (sub) {
            case "create": {

                if (data) { //if there is data which means already used /setup create

                    const channel = guild.channels.cache.get(data.Channel)

                    if (channel) { //if there is data as well as the channel

                        await interaction.deferReply({ ephemeral: true })

                        return interaction.editReply({
                            embeds: [errEmbed.setDescription(`The music channel is already set on <#${channel.id}>`)]
                        })
                    }

                    else { //if there is data but not the channel

                        await interaction.deferReply()

                        await data.delete()

                        await setupCreate(data, guild, client, interaction)

                        return interaction.editReply({
                            embeds: [new EmbedBuilder()
                                .setColor(client.data.color)
                                .setDescription(`Successfully created the music setup in <#${data.Channel}>`)
                            ]
                        })

                    }

                } else { // if there is no data i.e no setup created

                    await interaction.deferReply()

                    if (!data) return interaction.editReply({
                        embeds: [new EmbedBuilder()
                            .setColor(client.data.color)
                            .setDescription(`Something went wrong!`)
                        ]
                    })

                    await setupCreate(data, guild, client, interaction)

                    let v = await DB.findOne({ Guild: interaction.guild?.id }).catch(err => { })

                    interaction.editReply({
                        embeds: [new EmbedBuilder()
                            .setColor(client.data.color)
                            .setDescription(`Successfully created the music setup in <#${v?.Channel}>`)
                        ]
                    })

                }

            }

                break;

            case "delete": {

                if (!data) { // if there is no data to delete

                    await interaction.deferReply({ ephemeral: true })

                    return interaction.editReply({
                        embeds: [errEmbed.setDescription(`No music setup found for this server`)]

                    })
                } else { // if data found to be deleted

                    await interaction.deferReply()

                    try { // tries to delete those channels
                        const channel = guild.channels.cache.get(data.Channel) as GuildChannel
                        const vc = guild.channels.cache.get(data.VoiceChannel) as GuildChannel

                        if (!channel && !vc) return

                        let parent

                        if (channel && !vc) parent = channel.parent
                        else if (vc && !channel) parent = vc.parent
                        else parent = channel.parent

                        if (channel.deletable) await channel.delete()
                        if (vc.deletable) await vc?.delete()
                        if (parent?.deletable) await parent?.delete()

                    } catch (error) { }

                    await data.delete()

                    interaction.editReply({
                        embeds: [new EmbedBuilder()
                            .setColor(client.data.color)
                            .setDescription(`Successfully deleted the music setup for this server`)
                        ]
                    })

                }

            }
                break;

            case "info": {

                await interaction.deferReply()

                let status
                let vcStatus

                if (data && guild.channels.cache.get(data?.Channel)) status = 'Enabled'
                else status = 'Disabled'

                if (data && guild.channels.cache.get(data?.VoiceChannel)) vcStatus = 'Enabled'
                else vcStatus = 'Disabled'

                let details = `
                    **Current Status**: \`${status}\`\
                    \n\n**Music Channel**: ${status === 'Enabled' ? `<#${data?.Channel}>` : '\`No Channel\`'}\
                    \n\n**Voice Channel**: ${vcStatus === 'Enabled' ? `<#${data?.VoiceChannel}>` : '\`No Channel\`'}\
                `

                const Embed = new EmbedBuilder()
                    .setColor(status === 'Enabled' ? 'Green' : 'DarkRed')
                    .setDescription(details)
                    .setTitle(`__Music Setup Status__`)
                    .setThumbnail(guild.iconURL())
                    .setTimestamp()
                    .setFooter({ text: `${status}` })

                interaction.editReply({
                    embeds: [Embed]
                })

            }
                break;
        }
    }
})