const { Client, Guild, EmbedBuilder } = require("discord.js")

module.exports = {
    name: "guildCreate",

    /**
     * @param {Guild} guild
     * @param {Client} client
     */
    async execute(guild, client) {

        const logChannel = client.config.GuildLog
        const channel = client.channels.cache.get(logChannel)

        if (!channel) return console.log("[WARNING] NO NEW GUILD LOG CHANNEL FOUND!")

        const guildLogo = guild.iconURL()
        if (!guild.iconURL) guildLogo = 'https://png.pngtree.com/png-clipart/20200701/original/pngtree-red-error-icon-png-image_5418881.jpg'

        const owner = guild.members.cache.get(guild.ownerId)

        return channel.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `New Server - ${guild.name}`, iconURL: guildLogo })
                    .setThumbnail(guildLogo)
                    .setTimestamp()
                    .setColor("DarkBlue")
                    .setDescription(`\`\`\`Name: ${guild.name}\
                    \nID: ${guild.id}\
                    \nOwner: ${owner.displayName} (${guild.ownerId})\
                    \nMembers: ${guild.memberCount}\`\`\``)
                    .setFooter({text: `Total - ${client.guilds.cache.size}`})
            ]
        })
    }
}