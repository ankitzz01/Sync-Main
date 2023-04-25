import { ChatInputCommandInteraction, SharedNameAndDescription, SlashCommandBuilder } from "discord.js";
import { CustomClient } from "../../classes/index.js";

export interface BaseApplicationCommand {
    data: SharedNameAndDescription | SlashCommandBuilder
    botOwnerOnly?: boolean;
    category: "Filter" | "General" | "Music" | "Others" | "Playlist";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute: (interaction: ChatInputCommandInteraction, client: CustomClient) => any;
}