import { SlashCommand, reply } from "../../structure/index.js"
import { SlashCommandBuilder } from "discord.js"

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Shows my ping"),
    category: "General",
    execute(interaction, client) {

        return reply(interaction, "⌛", `Ping: **${client.ws.ping}** ms`, true)

    }
})