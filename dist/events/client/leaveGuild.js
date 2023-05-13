"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_js_1 = require("../../structure/index.js");
exports.default = new index_js_1.Event({
    name: discord_js_1.Events.GuildDelete,
    async execute(guild, client) {
        const Embed = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: `Removed from - ${guild.name}`, iconURL: `${guild.iconURL() ? guild.iconURL() : null}` })
            .setThumbnail(guild.iconURL() ? guild.iconURL() : null)
            .setTimestamp()
            .setColor("DarkRed")
            .setDescription(`\`\`\`Name: ${guild.name}\
                    \nID: ${guild.id}\
                    \nOwner: ${guild.ownerId}\
                    \nMembers: ${guild.memberCount}\`\`\``)
            .setFooter({ text: `Total - ${client.guilds.cache.size}` });
        (0, index_js_1.log)(client, Embed, client.data.devBotEnabled ? client.data.dev.log.guild : client.data.prod.log.guild);
    }
});
