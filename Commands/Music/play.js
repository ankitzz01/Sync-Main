const { Client, ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js")
const check = require("../../Functions/check")
const { playSong } = require("../../Functions/playSong")

module.exports = {
    name: "play",
    description: "Play a song",
    category: "Music",
    BotPerms: ["Connect", "Speak"],
    options: [
        {
            name: "query",
            description: "Provide the song name or URL",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        }
    ],
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction, client) {

        const { options, user, guild, member, channel } = interaction

        if (await check.memberVoice(interaction)) return
        if (await check.joinable(interaction)) return
        if (await check.differentVoice(interaction)) return

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