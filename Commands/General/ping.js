const { Client, ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js")
const Reply = require("../../Systems/Reply")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Shows my ping"),
    category: "General",

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        return Reply(interaction, "⌛", `Ping: **${client.ws.ping}** ms`, true)

    }

}