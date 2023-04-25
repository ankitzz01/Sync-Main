"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const structure_1 = require("../../structure");
const discord_js_1 = require("discord.js");
const musicchannel_1 = __importDefault(require("../../schemas/musicchannel"));
const button_1 = require("../../systems/button");
async function setupCreate(data, guild, client, interaction) {
    const parent = await guild.channels.create({
        name: `${client.user?.username.toLowerCase()} zone`,
        type: discord_js_1.ChannelType.GuildCategory,
        permissionOverwrites: [
            {
                type: 0,
                id: guild.roles.cache.find((x) => x.name === "@everyone")?.id,
                allow: [
                    discord_js_1.PermissionFlagsBits.SendMessages,
                    discord_js_1.PermissionFlagsBits.ViewChannel,
                    discord_js_1.PermissionFlagsBits.EmbedLinks,
                ],
            },
            {
                type: 1,
                id: client.user?.id,
                allow: [
                    discord_js_1.PermissionFlagsBits.SendMessages,
                    discord_js_1.PermissionFlagsBits.ViewChannel,
                    discord_js_1.PermissionFlagsBits.Connect,
                    discord_js_1.PermissionFlagsBits.EmbedLinks,
                    discord_js_1.PermissionFlagsBits.Speak
                ]
            },
        ],
    });
    const textChannel = await interaction.guild?.channels.create({
        name: `music-request`,
        type: discord_js_1.ChannelType.GuildText,
        parent: parent.id,
        permissionOverwrites: [
            {
                type: 0,
                id: guild.roles.cache.find((x) => x.name === "@everyone")?.id,
                allow: [
                    discord_js_1.PermissionFlagsBits.ViewChannel,
                    discord_js_1.PermissionFlagsBits.ReadMessageHistory
                ],
                deny: [
                    discord_js_1.PermissionFlagsBits.SendMessages,
                ]
            },
            {
                type: 1,
                id: client.user?.id,
                allow: [
                    discord_js_1.PermissionFlagsBits.SendMessages,
                    discord_js_1.PermissionFlagsBits.ViewChannel,
                    discord_js_1.PermissionFlagsBits.EmbedLinks,
                ]
            },
        ],
    });
    const voiceChannel = await interaction.guild?.channels.create({
        name: `${client.user?.username}`,
        type: discord_js_1.ChannelType.GuildVoice,
        userLimit: 25,
        parent: parent.id,
        permissionOverwrites: [
            {
                type: 0,
                id: guild.roles.cache.find((x) => x.name === "@everyone")?.id,
                allow: [
                    discord_js_1.PermissionFlagsBits.ViewChannel,
                    discord_js_1.PermissionFlagsBits.Connect,
                ],
                deny: [
                    discord_js_1.PermissionFlagsBits.Speak
                ]
            },
            {
                type: 1,
                id: client.user?.id,
                allow: [
                    discord_js_1.PermissionFlagsBits.ViewChannel,
                    discord_js_1.PermissionFlagsBits.Connect,
                    discord_js_1.PermissionFlagsBits.Speak
                ]
            },
        ],
    });
    let title;
    let image;
    const player = client.player.players.get(interaction.guild?.id);
    if (player && player.playing && player.queue.current) {
        title = player.queue.current.title;
        image = player.queue.current.displayThumbnail("maxresdefault") || client.data.links.background;
    }
    else {
        title = `No song playing currently`;
        image = client.data.links.background;
    }
    let mainEmbed = new discord_js_1.EmbedBuilder()
        .setColor(client.data.color)
        .setTitle(`${title}`)
        .setImage(`${image}`)
        .setDescription(`**[Invite Me](${client.data.links.invite})  :  [Support Server](${client.data.links.support})  :  [Vote Me](${client.data.links.topgg})**`);
    const panel = await textChannel?.send({
        embeds: [mainEmbed],
        components: [button_1.panelbutton]
    });
    data = new musicchannel_1.default({
        Guild: interaction.guild?.id,
        Channel: textChannel?.id,
        VoiceChannel: voiceChannel?.id,
        Message: panel?.id
    });
    await data.save();
}
exports.default = new structure_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName("setup")
        .setDescription("Setup the sync music requesting channel")
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageGuild)
        .addSubcommand(sub => sub.setName('create').setDescription('Setup the music channel'))
        .addSubcommand(sub => sub.setName('delete').setDescription('Delete the current music channel'))
        .addSubcommand(sub => sub.setName('info').setDescription('Check the current status of the music setup')),
    category: "Others",
    async execute(interaction, client) {
        const sub = interaction.options.getSubcommand();
        const errEmbed = new discord_js_1.EmbedBuilder()
            .setColor("DarkRed");
        const guild = interaction.guild;
        if (!guild?.members.me?.permissions.has(discord_js_1.PermissionFlagsBits.ManageChannels))
            return interaction.reply({
                embeds: [errEmbed.setDescription(`Missing permissions for \`ManageChannels\`.`)], ephemeral: true
            });
        let data = await musicchannel_1.default.findOne({ Guild: interaction.guild?.id });
        switch (sub) {
            case "create":
                {
                    if (data) {
                        const channel = guild.channels.cache.get(data.Channel);
                        if (channel) {
                            await interaction.deferReply({ ephemeral: true });
                            return interaction.editReply({
                                embeds: [errEmbed.setDescription(`The music channel is already set on <#${channel.id}>`)]
                            });
                        }
                        else {
                            await interaction.deferReply();
                            await data.delete();
                            await setupCreate(data, guild, client, interaction);
                            return interaction.editReply({
                                embeds: [new discord_js_1.EmbedBuilder()
                                        .setColor(client.data.color)
                                        .setDescription(`Successfully created the music setup in <#${data.Channel}>`)
                                ]
                            });
                        }
                    }
                    else {
                        await interaction.deferReply();
                        if (!data)
                            return interaction.editReply({
                                embeds: [new discord_js_1.EmbedBuilder()
                                        .setColor(client.data.color)
                                        .setDescription(`Something went wrong!`)
                                ]
                            });
                        await setupCreate(data, guild, client, interaction);
                        let v = await musicchannel_1.default.findOne({ Guild: interaction.guild?.id }).catch(err => { });
                        interaction.editReply({
                            embeds: [new discord_js_1.EmbedBuilder()
                                    .setColor(client.data.color)
                                    .setDescription(`Successfully created the music setup in <#${v?.Channel}>`)
                            ]
                        });
                    }
                }
                break;
            case "delete":
                {
                    if (!data) {
                        await interaction.deferReply({ ephemeral: true });
                        return interaction.editReply({
                            embeds: [errEmbed.setDescription(`No music setup found for this server`)]
                        });
                    }
                    else {
                        await interaction.deferReply();
                        try {
                            const channel = guild.channels.cache.get(data.Channel);
                            const vc = guild.channels.cache.get(data.VoiceChannel);
                            if (!channel && !vc)
                                return;
                            let parent;
                            if (channel && !vc)
                                parent = channel.parent;
                            else if (vc && !channel)
                                parent = vc.parent;
                            else
                                parent = channel.parent;
                            if (channel.deletable)
                                await channel.delete();
                            if (vc.deletable)
                                await vc?.delete();
                            if (parent?.deletable)
                                await parent?.delete();
                        }
                        catch (error) { }
                        await data.delete();
                        interaction.editReply({
                            embeds: [new discord_js_1.EmbedBuilder()
                                    .setColor(client.data.color)
                                    .setDescription(`Successfully deleted the music setup for this server`)
                            ]
                        });
                    }
                }
                break;
            case "info":
                {
                    await interaction.deferReply();
                    let status;
                    let vcStatus;
                    if (data && guild.channels.cache.get(data?.Channel))
                        status = 'Enabled';
                    else
                        status = 'Disabled';
                    if (data && guild.channels.cache.get(data?.VoiceChannel))
                        vcStatus = 'Enabled';
                    else
                        vcStatus = 'Disabled';
                    let details = `
                    **Current Status**: \`${status}\`\
                    \n\n**Music Channel**: ${status === 'Enabled' ? `<#${data?.Channel}>` : '\`No Channel\`'}\
                    \n\n**Voice Channel**: ${vcStatus === 'Enabled' ? `<#${data?.VoiceChannel}>` : '\`No Channel\`'}\
                `;
                    const Embed = new discord_js_1.EmbedBuilder()
                        .setColor(status === 'Enabled' ? 'Green' : 'DarkRed')
                        .setDescription(details)
                        .setTitle(`__Music Setup Status__`)
                        .setThumbnail(guild.iconURL())
                        .setTimestamp()
                        .setFooter({ text: `${status}` });
                    interaction.editReply({
                        embeds: [Embed]
                    });
                }
                break;
        }
    }
});
