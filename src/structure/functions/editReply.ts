import { Colors, EmbedBuilder } from "discord.js";
import { ValidInteractionTypes } from "./reply.js";

export function editReply(interaction: ValidInteractionTypes, emoji: string, description: string) {
    interaction.editReply({
        embeds: [
            new EmbedBuilder()
                .setColor(Colors.Blue)
                .setDescription(`\`${emoji}\` | ${description}`)
        ]
    });
}