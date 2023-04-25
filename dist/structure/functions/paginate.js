"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = void 0;
const discord_js_1 = require("discord.js");
const index_js_1 = require("./index.js");
async function paginate(interaction, embeds) {
    await interaction.deferReply();
    const previousPage = "<:white_hard_left:1062415226219266068>";
    const nextPage = "<:white_hard_right:1062415230971424808>";
    const closePage = "<:whitecross:1026545632686653550>";
    const firstPage = "<:white_left:1062415235241222154>";
    const lastPage = "<:white_right:1062415239020302437>";
    const buttons = [
        new discord_js_1.ButtonBuilder()
            .setCustomId("pagination-firstPage")
            .setEmoji(firstPage)
            .setStyle(discord_js_1.ButtonStyle.Primary)
            .setDisabled(true),
        new discord_js_1.ButtonBuilder()
            .setCustomId("pagination-previousPage")
            .setEmoji(previousPage)
            .setStyle(discord_js_1.ButtonStyle.Primary)
            .setDisabled(true),
        new discord_js_1.ButtonBuilder()
            .setCustomId("pagination-closePage")
            .setEmoji(closePage)
            .setStyle(discord_js_1.ButtonStyle.Danger),
        new discord_js_1.ButtonBuilder()
            .setCustomId("pagination-nextPage")
            .setEmoji(nextPage)
            .setStyle(discord_js_1.ButtonStyle.Primary),
        new discord_js_1.ButtonBuilder()
            .setCustomId("pagination-lastPage")
            .setEmoji(lastPage)
            .setStyle(discord_js_1.ButtonStyle.Primary)
    ];
    const row = new discord_js_1.ActionRowBuilder().setComponents(...buttons);
    let currentPage = 0;
    const message = await interaction.editReply({ embeds: [embeds[currentPage]], components: [row] });
    const collector = message.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.Button, time: 60 * 1000 * 5 });
    collector.on("collect", (i) => {
        if (i.user.id !== interaction.user.id)
            return (0, index_js_1.reply)(i, "❌", "This is not your message");
        switch (i.customId) {
            case "pagination-firstPage": {
                currentPage = 0;
                break;
            }
            case "pagination-previousPage": {
                currentPage--;
                break;
            }
            case "pagination-closePage": {
                currentPage = -1;
                break;
            }
            case "pagination-nextPage": {
                currentPage++;
                break;
            }
            case "pagination-lastPage": {
                currentPage = embeds.length - 1;
                break;
            }
        }
        switch (currentPage) {
            case 0: {
                buttons[0].setDisabled(true);
                buttons[1].setDisabled(true);
                buttons[3].setDisabled(false);
                buttons[4].setDisabled(false);
                break;
            }
            case embeds.length - 1: {
                buttons[0].setDisabled(false);
                buttons[1].setDisabled(false);
                buttons[3].setDisabled(true);
                buttons[4].setDisabled(true);
                break;
            }
            case -1: {
                buttons[0].setDisabled(true);
                buttons[1].setDisabled(true);
                buttons[2].setDisabled(true);
                buttons[3].setDisabled(true);
                buttons[4].setDisabled(true);
                break;
            }
            case 1: {
                buttons[0].setDisabled(false);
                buttons[1].setDisabled(false);
                break;
            }
            case embeds.length - 2: {
                buttons[0].setDisabled(false);
                buttons[1].setDisabled(false);
                buttons[3].setDisabled(false);
                buttons[4].setDisabled(false);
                break;
            }
        }
        const newRow = new discord_js_1.ActionRowBuilder().setComponents(buttons);
        i.deferUpdate();
        message.edit({ embeds: [embeds[currentPage]], components: [newRow] });
    });
    collector.on("end", () => {
        buttons[0].setDisabled(true);
        buttons[1].setDisabled(true);
        buttons[2].setDisabled(true);
        buttons[3].setDisabled(true);
        buttons[4].setDisabled(true);
        const endRow = new discord_js_1.ActionRowBuilder().setComponents(buttons);
        message.edit({ components: [endRow] });
    });
}
exports.paginate = paginate;
