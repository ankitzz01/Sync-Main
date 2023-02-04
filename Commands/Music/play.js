const { Client, ChatInputCommandInteraction, ApplicationCommandOptionType, SlashCommandBuilder } = require("discord.js")
const check = require("../../Functions/check")
const { playSong } = require("../../Functions/playSong")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song')
        .addStringOption(opt => 
            opt.setName('query')
                .setDescription('Enter a song name to play')
                .setRequired(true)
                .setAutocomplete(true)
        ),
    category: "Music",
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction, client) {

        const { options, user, guild, member, channel } = interaction

        if (await check.memberVoice(interaction)) return
        if (await check.joinable(interaction)) return
        if (await check.differentVoice(interaction)) return
        if (await check.stageCheck(interaction)) return

        const query = options.getString("query")

        const player = await client.player.create({
            guild: guild.id,
            voiceChannel: member.voice.channel.id,
            textChannel: channel.id,
            selfDeafen: true
        })

        await interaction.deferReply()

        playSong(interaction, client, player, query, user)

    }
}