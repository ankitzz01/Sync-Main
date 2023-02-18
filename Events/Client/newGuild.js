const { Client, Guild, EmbedBuilder, Events } = require("discord.js")
const { log } = require("../../Functions/log")

module.exports = {
    name: Events.GuildCreate,

    /**
     * @param {Guild} guild
     * @param {Client} client
     */
    async execute(guild, client) {

        const guildLogo = guild.iconURL() || null

        const embed = new EmbedBuilder()
            .setAuthor({ name: `New Server - ${guild.name}`, iconURL: guildLogo })
            .setThumbnail(guildLogo)
            .setTimestamp()
            .setColor("DarkGreen")
            .setDescription(`\`\`\`Name: ${guild.name}\
                    \nID: ${guild.id}\
                    \nOwner: ${guild.ownerId}\
                    \nMembers: ${guild.memberCount}\`\`\``)
            .setFooter({ text: `Total - ${client.guilds.cache.size}` })

        log(client, embed, client.config.guildLog)
    }
}