"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_js_1 = require("../../structure/index.js");
exports.default = new index_js_1.Event({
    name: discord_js_1.Events.InteractionCreate,
    async execute(interaction, client) {
        if (interaction.type !== discord_js_1.InteractionType.ModalSubmit)
            return;
        if (!interaction.guild || interaction.user.bot)
            return;
        if (!["owner-leave-modal", "owner-eval-modal"].includes(interaction.customId))
            return;
        await interaction.deferReply({ ephemeral: true });
        switch (interaction.customId) {
            case "owner-leave-modal":
                {
                    const id = interaction.fields.getTextInputValue("owner-leave-modal-guildId");
                    const Guild = await client.guilds.fetch(id);
                    if (!Guild)
                        return interaction.editReply({ content: "NO GUILD WAS FOUND WITH THAT ID" });
                    const Embed = new discord_js_1.EmbedBuilder()
                        .setColor(client.data.color)
                        .setTitle(`Left ${Guild.name}`)
                        .setDescription(`\`\`\`Successfully left the interaction.guild\nOwner ID: ${Guild.ownerId}\nMember Count: ${Guild.memberCount}\`\`\``)
                        .setThumbnail(Guild.iconURL())
                        .setTimestamp();
                    await Guild.leave();
                    interaction.editReply({
                        embeds: [Embed],
                    });
                }
                break;
            case "owner-eval-modal":
                {
                    const code = interaction.fields.getTextInputValue("owner-eval-modal-code");
                    try {
                        var result = eval(code);
                    }
                    catch (error) {
                        return interaction.editReply("THE CODE CAN'T BE EVALED");
                    }
                    if (!result)
                        return interaction.editReply("THE CODE CAN'T BE EVALED");
                    const Embed = new discord_js_1.EmbedBuilder()
                        .setColor(client.data.color)
                        .setDescription(`\`\`\`${result.toString()}\`\`\``)
                        .setTitle("__EVALED CODE__")
                        .setFooter({ text: "Eval" })
                        .setTimestamp();
                    interaction.editReply({ embeds: [Embed] });
                }
                break;
        }
    }
});
