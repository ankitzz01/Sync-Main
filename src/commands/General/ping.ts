import { CustomClient, SlashCommand } from "../../structure/index.js"

import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"
import { reply } from "../../structure"

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Shows my ping"),
    category: "General",
    async execute(interaction: ChatInputCommandInteraction, client: CustomClient) {

        return reply(interaction, "⌛", `Ping: **${client.ws.ping}** ms`, true)

    }
})