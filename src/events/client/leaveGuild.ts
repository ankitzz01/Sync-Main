import { EmbedBuilder, Events, Guild } from "discord.js"
import { CustomClient, Event, log } from "../../structure/index.js";

export default new Event({
    name: Events.GuildDelete,
    async execute(guild: Guild, client: CustomClient) {

        const Embed = new EmbedBuilder()
            .setAuthor({ name: `Removed from - ${guild.name}`, iconURL: `${guild.iconURL() ? guild.iconURL() : null}` })
            .setThumbnail(guild.iconURL() ? guild.iconURL() : null)
            .setTimestamp()
            .setColor("DarkRed")
            .setDescription(`\`\`\`Name: ${guild.name}\
                    \nID: ${guild.id}\
                    \nOwner: ${guild.ownerId}\
                    \nMembers: ${guild.memberCount}\`\`\``)
            .setFooter({ text: `Total - ${client.guilds.cache.size}` })

        log(client, Embed, client.data.devBotEnabled ? client.data.dev.log.guild : client.data.prod.log.guild)
    }
})