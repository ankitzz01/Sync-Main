"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_js_1 = require("../../structure/index.js");
const index_js_2 = require("../../structure/index.js");
const sdk_1 = require("@top-gg/sdk");
exports.default = new index_js_1.Event({
    name: discord_js_1.Events.InteractionCreate,
    async execute(interaction, client) {
        if (interaction.type !== discord_js_1.InteractionType.ApplicationCommand)
            return;
        const command = client.commands.get(interaction.commandName);
        await client.application?.fetch().catch(() => { });
        if (!command) {
            (0, index_js_1.reply)(interaction, "❌", "This command does not exist");
            return client.commands.delete(interaction.commandName);
        }
        if (command.botOwnerOnly && !client.data.developers.includes(interaction.user.id))
            return (0, index_js_1.reply)(interaction, "❌", "This command is only available for bot developers");
        const topgg = new sdk_1.Api(client.data.topgg.token);
        if (command.voteOnly && !(await topgg.hasVoted(interaction.user.id)))
            return (0, index_js_1.reply)(interaction, "❌", `You must vote me on [top.gg](${client.data.topgg.vote}) before using this command`);
        command.execute(interaction, client);
        const Embed = new discord_js_1.EmbedBuilder()
            .setColor("DarkBlue")
            .setAuthor({ name: `${interaction.guild?.name}`, iconURL: interaction.guild?.iconURL() || client.user?.displayAvatarURL() })
            .setDescription(`\`\`\`Used In: ${interaction.guild?.name} (${interaction.guild?.id})\
        \nCommand Used: ${interaction.commandName} (${interaction.commandId})\
        \nUsed by: ${interaction.user.tag} (${interaction.user.id})\`\`\``);
        (0, index_js_2.log)(client, Embed, client.data.prod.log.command);
    }
});
