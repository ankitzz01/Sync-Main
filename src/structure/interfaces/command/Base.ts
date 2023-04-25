import { ChatInputCommandInteraction, SharedNameAndDescription, SlashCommandBuilder } from "discord.js";
import { CustomClient } from "../../classes/index.js";

export interface BaseApplicationCommand {
    data: SharedNameAndDescription | SlashCommandBuilder
    category: "Filter" | "General" | "Music" | "Others" | "Playlist";
    botOwnerOnly?: boolean;
    voteOnly?: boolean;
    execute: (interaction: ChatInputCommandInteraction, client: CustomClient) => any;
}