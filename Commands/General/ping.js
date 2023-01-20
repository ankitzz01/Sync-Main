const { Client, ChatInputCommandInteraction } = require("discord.js")
const Reply = require("../../Systems/Reply")

module.exports = {
    name: "ping",
    description: "Shows my Ping",
    category: "General",

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        return Reply(interaction, "⌛", `Ping: **${client.ws.ping}** ms`, true)

    }

}