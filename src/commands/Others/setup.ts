import { CustomClient, SlashCommand, reply, editReply } from "../../structure/index.js"
import { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits, Guild, ChatInputCommandInteraction, GuildChannel, CategoryChannel, BaseGuildTextChannel } from "discord.js"
import DB, { MusicChannelSchema } from "../../schemas/musicchannel"
import { panelbutton } from "../../systems/button"

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
    voteOnly: true,
    async execute(interaction, client) {

        if (!interaction.guild?.members.me?.permissions.has(PermissionFlagsBits.ManageChannels)) return reply(
            interaction, "❌", `Missing permissions for \`ManageChannels\`.`, true
        )
        let data = await DB.findOne<MusicChannelSchema>({ Guild: interaction.guild?.id })

        switch (interaction.options.getSubcommand()) {
            case "create": {

                if (data) { //if there is data which means already used /setup create

                    const channel = await interaction.guild.channels.fetch(data.Channel) as BaseGuildTextChannel
                    if (channel) { //if there is data as well as the channel
                        await interaction.deferReply({ ephemeral: true })
                        return editReply(interaction, "❌", `The music channel is already set on <#${channel.id}>`)
                    } else { //if there is data but not the channel

                        await interaction.deferReply()
                        await data.delete()
                        let newdata = await setupCreate(interaction, client)
                        return editReply(interaction, "✅", `Successfully created the music setup in <#${newdata?.Channel}>`)
                    }

                } else { // if there is no data i.e no setup created

                    await interaction.deferReply()
                    let newdata = await setupCreate(interaction, client)

                    editReply(interaction, "✅", `Successfully created the music setup in <#${newdata?.Channel}>`)
                }
            }

                break;

            case "delete": {

                if (!data) { // if there is no data to delete

                    await interaction.deferReply({ ephemeral: true })
                    return editReply(interaction, "❌", "No music setup found for this server")

                } else { // if data found to be deleted

                    await interaction.deferReply()

                    try { // tries to delete those channels
                        const channel = await interaction.guild.channels.fetch(data.Channel) as GuildChannel
                        const vc = await interaction.guild.channels.fetch(data.VoiceChannel) as GuildChannel
                        if (!channel && !vc) return
                        let parent: CategoryChannel
                        if (channel && !vc) parent = channel.parent as CategoryChannel
                        else if (vc && !channel) parent = vc.parent as CategoryChannel
                        else parent = channel.parent as CategoryChannel

                        if (channel.deletable) await channel.delete()
                        if (vc.deletable) await vc?.delete()
                        if (parent?.deletable) await parent?.delete()

                    } catch (error) { }

                    await data.delete()
                    editReply(interaction, "✅", "Successfully deleted the music setup for this server")
                }
            }
                break;

            case "info": {

                await interaction.deferReply()

                let status: string, vcStatus: string

                if (data && await interaction.guild.channels.fetch(data?.Channel)) status = 'Enabled'
                else status = 'Disabled'
                if (data && await interaction.guild.channels.fetch(data?.VoiceChannel)) vcStatus = 'Enabled'
                else vcStatus = 'Disabled'

                const Embed = new EmbedBuilder()
                    .setColor(status === 'Enabled' ? 'Green' : 'DarkRed')
                    .setDescription(`
                    **Current Status**: \`${status}\`\
                    \n\n**Music Channel**: ${status === 'Enabled' ? `<#${data?.Channel}>` : '\`No Channel\`'}\
                    \n\n**Voice Channel**: ${vcStatus === 'Enabled' ? `<#${data?.VoiceChannel}>` : '\`No Channel\`'}\
                `)
                    .setTitle(`__Music Setup Status__`)
                    .setThumbnail(interaction.guild.iconURL())
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

async function setupCreate(interaction: ChatInputCommandInteraction, client: CustomClient) {

    const parent = await interaction.guild?.channels.create({
        name: `${client.user?.username.toLowerCase()} zone`,
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
            {
                type: 0,
                id: interaction.guild?.roles.cache.find((x) => x.name === "@everyone")?.id as string,
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
        parent: parent?.id,
        permissionOverwrites: [
            {
                type: 0,
                id: interaction.guild.roles.cache.find((x) => x.name === "@everyone")?.id as string,
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
        parent: parent?.id,
        permissionOverwrites: [
            {
                type: 0,
                id: interaction.guild?.roles.cache.find((x) => x.name === "@everyone")?.id as string,
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

    let title: string, image: string
    const player = client.player.players.get(interaction.guild?.id as string)

    if (player && player.playing && player.queue.current) {
        title = player.queue.current.title || "Unknown track"
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
            `**[Invite Me](${client.data.links.invite})  :  [Support Server](${client.data.links.support})  :  [Vote Me](${client.data.topgg.vote})**`
        )

    const panel = await textChannel?.send({
        embeds: [mainEmbed],
        components: [panelbutton]
    })

    let data = await new DB({
        Guild: interaction.guild?.id,
        Channel: textChannel?.id,
        VoiceChannel: voiceChannel?.id,
        Message: panel?.id
    }).save() as MusicChannelSchema

    return data
}