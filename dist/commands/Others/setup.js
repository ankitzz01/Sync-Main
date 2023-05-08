"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../structure/index.js");
const discord_js_1 = require("discord.js");
const musicchannel_1 = __importDefault(require("../../schemas/musicchannel"));
const button_1 = require("../../systems/button");
exports.default = new index_js_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName("setup")
        .setDescription("Setup the sync music requesting channel")
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageGuild)
        .addSubcommand(sub => sub.setName('create').setDescription('Setup the music channel'))
        .addSubcommand(sub => sub.setName('delete').setDescription('Delete the current music channel'))
        .addSubcommand(sub => sub.setName('info').setDescription('Check the current status of the music setup')),
    category: "Others",
    async execute(interaction, client) {
        if (!interaction.guild?.members.me?.permissions.has(discord_js_1.PermissionFlagsBits.ManageChannels))
            return (0, index_js_1.reply)(interaction, "❌", `Missing permissions for \`ManageChannels\`.`, true);
        let data = await musicchannel_1.default.findOne({ Guild: interaction.guild?.id });
        switch (interaction.options.getSubcommand()) {
            case "create":
                {
                    if (data) {
                        const channel = await interaction.guild.channels.fetch(data.Channel);
                        if (channel) {
                            await interaction.deferReply({ ephemeral: true });
                            return (0, index_js_1.editReply)(interaction, "❌", `The music channel is already set on <#${channel.id}>`);
                        }
                        else {
                            await interaction.deferReply();
                            await data.delete();
                            let newdata = await setupCreate(interaction, client);
                            return (0, index_js_1.editReply)(interaction, "✅", `Successfully created the music setup in <#${newdata?.Channel}>`);
                        }
                    }
                    else {
                        await interaction.deferReply();
                        let newdata = await setupCreate(interaction, client);
                        (0, index_js_1.editReply)(interaction, "✅", `Successfully created the music setup in <#${newdata?.Channel}>`);
                    }
                }
                break;
            case "delete":
                {
                    if (!data) {
                        await interaction.deferReply({ ephemeral: true });
                        return (0, index_js_1.editReply)(interaction, "❌", "No music setup found for this server");
                    }
                    else {
                        await interaction.deferReply();
                        try {
                            const channel = await interaction.guild.channels.fetch(data.Channel);
                            const vc = await interaction.guild.channels.fetch(data.VoiceChannel);
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
                        (0, index_js_1.editReply)(interaction, "✅", "Successfully deleted the music setup for this server");
                    }
                }
                break;
            case "info":
                {
                    await interaction.deferReply();
                    let status, vcStatus;
                    if (data && await interaction.guild.channels.fetch(data?.Channel))
                        status = 'Enabled';
                    else
                        status = 'Disabled';
                    if (data && await interaction.guild.channels.fetch(data?.VoiceChannel))
                        vcStatus = 'Enabled';
                    else
                        vcStatus = 'Disabled';
                    const Embed = new discord_js_1.EmbedBuilder()
                        .setColor(status === 'Enabled' ? 'Green' : 'DarkRed')
                        .setDescription(`
                    **Current Status**: \`${status}\`\
                    \n\n**Music Channel**: ${status === 'Enabled' ? `<#${data?.Channel}>` : '\`No Channel\`'}\
                    \n\n**Voice Channel**: ${vcStatus === 'Enabled' ? `<#${data?.VoiceChannel}>` : '\`No Channel\`'}\
                `)
                        .setTitle(`__Music Setup Status__`)
                        .setThumbnail(interaction.guild.iconURL())
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
async function setupCreate(interaction, client) {
    const parent = await interaction.guild?.channels.create({
        name: `${client.user?.username.toLowerCase()} zone`,
        type: discord_js_1.ChannelType.GuildCategory,
        permissionOverwrites: [
            {
                type: 0,
                id: interaction.guild?.roles.cache.find((x) => x.name === "@everyone")?.id,
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
        parent: parent?.id,
        permissionOverwrites: [
            {
                type: 0,
                id: interaction.guild.roles.cache.find((x) => x.name === "@everyone")?.id,
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
        parent: parent?.id,
        permissionOverwrites: [
            {
                type: 0,
                id: interaction.guild?.roles.cache.find((x) => x.name === "@everyone")?.id,
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
    let title, image;
    const player = client.player.players.get(interaction.guild?.id);
    if (player && player.playing && player.queue.current) {
        title = player.queue.current.title || "Unknown track";
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
        .setDescription(`**[Invite Me](${client.data.links.invite})  :  [Support Server](${client.data.links.support})  :  [Vote Me](${client.data.topgg.vote})**`);
    const panel = await textChannel?.send({
        embeds: [mainEmbed],
        components: [button_1.panelbutton]
    });
    let data = await new musicchannel_1.default({
        Guild: interaction.guild?.id,
        Channel: textChannel?.id,
        VoiceChannel: voiceChannel?.id,
        Message: panel?.id
    }).save();
    return data;
}
