import { Colors, EmbedBuilder } from "discord.js";
import { ValidInteractionTypes } from "./reply.js";
import client from "../../index.js";

export function editReply(interaction: ValidInteractionTypes, emoji: string, description: string) {
    interaction.editReply({
        embeds: [
            new EmbedBuilder()
                .setColor(emoji === "❌" ? Colors.DarkRed : client.data.color)
                .setDescription(`\`${emoji}\` | ${description}`)
        ]
    });
}