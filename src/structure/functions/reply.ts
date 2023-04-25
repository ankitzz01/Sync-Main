import { AnySelectMenuInteraction, ButtonInteraction, ChatInputCommandInteraction, Colors, EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import client from "../../index.js";

export type ValidInteractionTypes =
    ChatInputCommandInteraction |
    ButtonInteraction |
    AnySelectMenuInteraction |
    ModalSubmitInteraction;

export function reply(interaction: ValidInteractionTypes, emoji: string, description: string, ephemeral: boolean = true) {
    interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setColor(emoji === "❌" ? Colors.DarkRed : client.data.color)
                .setDescription(`\`${emoji}\` | ${description}`)
        ],
        ephemeral
    });
}