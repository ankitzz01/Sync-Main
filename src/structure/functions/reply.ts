import { AnySelectMenuInteraction, ButtonInteraction, ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import client from "../../index.js";

export type ValidInteractionTypes =
    ChatInputCommandInteraction |
    ButtonInteraction |
    AnySelectMenuInteraction |
    ModalSubmitInteraction;

export function reply(interaction: ValidInteractionTypes, emoji: string, description: string, ephemeral: boolean = true, color: string = client.color) {
    interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setColor(color as ColorResolvable)
                .setDescription(`\`${emoji}\` | ${description}`)
        ],
        ephemeral
    });
}