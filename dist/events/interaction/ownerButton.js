"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_js_1 = require("../../structure/index.js");
exports.default = new index_js_1.Event({
    name: discord_js_1.Events.InteractionCreate,
    async execute(interaction, client) {
        if (!interaction.isButton())
            return;
        if (!["owner-leave", "owner-servers", "owner-eval"].includes(interaction.customId))
            return;
        if (!client.data.developers.includes(interaction.user.id))
            return (0, index_js_1.reply)(interaction, "❌", "You cannot use this buttons", true);
        switch (interaction.customId) {
            case "owner-servers":
                {
                    const servers = serverEmbed(Array.from(client.guilds.cache), 10, client);
                    (0, index_js_1.paginate)(interaction, servers);
                }
                break;
            case "owner-leave":
                {
                    const modal = new discord_js_1.ModalBuilder()
                        .setCustomId("owner-leave-modal")
                        .setTitle("Guild Leave");
                    const guildId = new discord_js_1.TextInputBuilder()
                        .setCustomId("owner-leave-modal-guildId")
                        .setLabel("GUILD ID")
                        .setStyle(discord_js_1.TextInputStyle.Short)
                        .setPlaceholder("Enter the Guild ID to leave")
                        .setRequired(true);
                    const RowTop = new discord_js_1.ActionRowBuilder().addComponents(guildId);
                    modal.addComponents(RowTop);
                    await interaction.showModal(modal);
                }
                break;
            case "owner-eval":
                {
                    const modal = new discord_js_1.ModalBuilder()
                        .setCustomId("owner-eval-modal")
                        .setTitle("Eval");
                    const code = new discord_js_1.TextInputBuilder()
                        .setCustomId("owner-eval-modal-code")
                        .setLabel("CODE")
                        .setStyle(discord_js_1.TextInputStyle.Paragraph)
                        .setPlaceholder("Enter the code to eval")
                        .setRequired(true);
                    const RowTop = new discord_js_1.ActionRowBuilder().addComponents(code);
                    modal.addComponents(RowTop);
                    await interaction.showModal(modal);
                }
                break;
        }
    },
});
function serverEmbed(pages, number, client) {
    const Embeds = [];
    let k = number;
    for (let i = 0; i < pages.length; i += number) {
        const current = pages.slice(i, k);
        k += number;
        const MappedData = current.map(x => {
            return `Name: ${x[1].name} | ID: ${x[1].id}\n${x[1].memberCount} Members | Owner: ${x[1].ownerId}`;
        }).join("\n\n");
        const LIST = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: `${client.user?.username} is in ${client.guilds.cache.size} server`, iconURL: client.user?.displayAvatarURL() })
            .setColor("DarkRed")
            .setDescription(`\`\`\`${MappedData}\`\`\``);
        Embeds.push(LIST);
    }
    return Embeds;
}
