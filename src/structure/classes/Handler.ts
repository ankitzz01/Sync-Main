import { ChannelType, Colors, EmbedBuilder, Events, RESTPostAPIApplicationCommandsJSONBody, SlashCommandBuilder } from "discord.js";
import { getAllFiles } from "../functions/index.js";
import { Event, SlashCommand, PlayerEvent, BaseApplicationCommand } from "../interfaces/index.js";
import { CustomClient } from "./index.js";

export class Handler {
    private client: CustomClient;
    constructor(client: CustomClient) {
        this.client = client;
    }

    async loadCommands(directory: string) {
        const files = getAllFiles(directory);
        if (!files.length) return;
        const publicCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];
        let loadedCommands = 0;

        for await (const file of files) {
            const command: SlashCommand = (await import(file)).default;

            publicCommands.push((command.data as SlashCommandBuilder).toJSON());

            this.client.commands.set((command.data as SlashCommandBuilder).name, command as BaseApplicationCommand);
            loadedCommands++;
        }

        if (loadedCommands !== 0) this.client.logger.info("System", `Commands Loaded : ${this.client.logger.highlight(loadedCommands.toString(), "success")}`);

        const pushCommands = async () => {
            await this.client.application?.commands.set(publicCommands);
            this.client.logger.info("System", `Current Mode : ${this.client.logger.highlight(this.client.data.devBotEnabled ? "Dev" : "Live", "error")}`);
        };

        if (!this.client.isReady()) this.client.once(Events.ClientReady, () => pushCommands());
        else pushCommands();
    }

    async loadEvents(directory: string) {
        const files = getAllFiles(directory);
        if (!files.length) return;
        let loadedEvents = 0;

        for await (const file of files) {
            const { data: event }: Event = (await import(file)).default;

            const execute = (...args: unknown[]) => event?.execute(...args, this.client);

            if (event?.name !== null) event?.once ? this.client.once(event?.name, execute) : this.client.on(event?.name, execute);
            else if (event?.name === null && event?.restEvent) event?.once ? this.client.rest.once(event?.restEvent, execute) : this.client.rest.on(event?.restEvent, execute);
            else throw new TypeError(`Event ${file.split("/").at(-2)}/${file.split("/").at(-1)} has no event name`);
            loadedEvents++;
        }

        if (loadedEvents !== 0) this.client.logger.info("System", `Events Loaded : ${this.client.logger.highlight(loadedEvents.toString(), "success")}`);
    }

    async loadErelaEvents(directory: string) {
        const files = getAllFiles(directory);
        if (!files.length) return;
        let loadedEvents = 0;

        for await (const file of files) {
            const { data: event }: PlayerEvent = (await import(file)).default;

            const execute = (...args: unknown[]) => event?.execute(...args, this.client);

            if (event?.name !== null) this.client.player.on(event?.name, execute);
            else throw new TypeError(`Event ${file.split("/").at(-2)}/${file.split("/").at(-1)} has no event name`);
            loadedEvents++;
        }

        if (loadedEvents !== 0) this.client.logger.info("System", `Erela Events Loaded : ${this.client.logger.highlight(loadedEvents.toString(), "success")}`);
    }

    catchErrors() {
        const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setTimestamp();

        const logsChannelId = this.client.data.devBotEnabled ? this.client.data.dev.log.error : this.client.data.prod.log.error;

        process
            .on("uncaughtException", async (err) => {
                this.client.logger.error("System", `Uncaught Exception : ${err}`);
                const channel = await this.client.channels.fetch(logsChannelId).catch(() => { });
                if (!channel || channel.type !== ChannelType.GuildText) return;

                channel.send({
                    embeds: [
                        embed
                            .setTitle("`⚠` | Uncaught Exception/Catch")
                            .setDescription([
                                "```" + err.stack + "```"
                            ].join("\n"))
                    ]
                }).catch(() => { });
            })
            .on("uncaughtExceptionMonitor", async (err) => {
                this.client.logger.error("System", `Uncaught Exception (Monitor) : ${err}`);
                const channel = await this.client.channels.fetch(logsChannelId).catch(() => { });
                if (!channel || channel.type !== ChannelType.GuildText) return;

                channel.send({
                    embeds: [
                        embed
                            .setTitle("`⚠` | Uncaught Exception/Catch (MONITOR)")
                            .setDescription([
                                "```" + err.stack + "```"
                            ].join("\n"))
                    ]
                }).catch(() => { });
            })
            .on("unhandledRejection", async (reason: Error) => {
                this.client.logger.error("System", `Unhandled Rejection/Catch : ${reason}`);
                const channel = await this.client.channels.fetch(logsChannelId).catch(() => { });
                if (!channel || channel.type !== ChannelType.GuildText) return;

                channel.send({
                    embeds: [
                        embed
                            .setTitle("`⚠` | Unhandled Rejection/Catch")
                            .setDescription([
                                "```" + reason.stack + "```"
                            ].join("\n"))
                    ]
                }).catch(() => { });
            });
    }
}