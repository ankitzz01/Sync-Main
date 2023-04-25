import { EmbedBuilder, ChannelType, ChatInputCommandInteraction, GuildMember, InteractionResponse, ButtonInteraction, StringSelectMenuInteraction, ModalSubmitInteraction, ModalMessageModalSubmitInteraction, AnySelectMenuInteraction } from "discord.js";

type ValidInteraction = ChatInputCommandInteraction | ButtonInteraction | AnySelectMenuInteraction | ModalSubmitInteraction

export async function joinable(interaction: ValidInteraction): Promise<boolean | InteractionResponse<boolean>> {

    if (!(interaction.member as GuildMember).voice.channel?.joinable) return interaction.reply({
        embeds: [new EmbedBuilder()
            .setColor("DarkRed")
            .setDescription("I do not have permission to join your voice channel!")
        ], ephemeral: true
    })

    else return false

}

export async function memberVoice(interaction: ValidInteraction): Promise<boolean | InteractionResponse<boolean>>  {

    if (!(interaction.member as GuildMember)?.voice.channel) return interaction.reply({
        embeds: [new EmbedBuilder()
            .setColor("DarkRed")
            .setDescription("You need to join a voice channel")
        ], ephemeral: true
    })

    else return false

}

export async function differentVoice(interaction: ValidInteraction): Promise<boolean | InteractionResponse<boolean>>  {

    if (interaction.guild?.members.me?.voice.channel && (interaction.member as GuildMember)?.voice.channel?.id !== interaction.guild.members.me.voice.channelId)
        return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription(`I am already playing music in <#${interaction.guild.members.me.voice.channelId}>`)
            ], ephemeral: true
        })

    else return false

}

export async function botVC(interaction: ValidInteraction): Promise<boolean | InteractionResponse<boolean>>  {

    if (!interaction.guild?.members.me?.voice.channel) return interaction.reply({
        embeds: [new EmbedBuilder()
            .setColor("DarkRed")
            .setDescription("I'm not connected to any voice channel")
        ], ephemeral: true
    })

    else return false

}

export async function stageCheck(interaction: ValidInteraction): Promise<boolean | InteractionResponse<boolean>>  {

    if ((interaction.member as GuildMember)?.voice.channel?.type == ChannelType.GuildStageVoice) return interaction.reply({
        embeds: [new EmbedBuilder()
            .setColor("DarkRed")
            .setDescription("Playing on Stage isn't supported yet")
        ], ephemeral: true
    })

    else return false

}