const { Client, Guild, EmbedBuilder } = require("discord.js")
const { log } = require("../../Functions/log")

module.exports = {
    name: "guildDelete",

    /**
     * @param {Guild} guild
     * @param {Client} client
     */
    async execute(guild, client) {

        const guildLogo = guild.iconURL()
        if (!guild.iconURL) guildLogo = null

        const Embed = new EmbedBuilder()
            .setAuthor({ name: `Removed from - ${guild.name}`, iconURL: guildLogo })
            .setThumbnail(guildLogo)
            .setTimestamp()
            .setColor("DarkBlue")
            .setDescription(`\`\`\`Name: ${guild.name}\
                    \nID: ${guild.id}\
                    \nMembers: ${guild.memberCount}\`\`\``)
            .setFooter({ text: `Total - ${client.guilds.cache.size}` })

        log(client, Embed, client.config.guildLog)
    }
}