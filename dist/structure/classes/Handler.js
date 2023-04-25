"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
const discord_js_1 = require("discord.js");
const index_js_1 = require("../functions/index.js");
class Handler {
    client;
    constructor(client) {
        this.client = client;
    }
    async loadCommands(directory) {
        var _a;
        const files = (0, index_js_1.getAllFiles)(directory);
        if (!files.length)
            return;
        const publicCommands = [];
        let loadedCommands = 0;
        for await (const file of files) {
            const command = (await (_a = file, Promise.resolve().then(() => __importStar(require(_a))))).default;
            publicCommands.push(command.data.toJSON());
            this.client.commands.set(command.data.name, command);
            loadedCommands++;
        }
        if (loadedCommands !== 0)
            this.client.logger.info("System", `Commands Loaded : ${this.client.logger.highlight(loadedCommands.toString(), "success")}`);
        const pushCommands = async () => {
            await this.client.application?.commands.set(publicCommands);
            this.client.logger.info("System", `Current Mode : ${this.client.logger.highlight(this.client.data.devBotEnabled ? "Dev" : "Live", "error")}`);
        };
        if (!this.client.isReady())
            this.client.once(discord_js_1.Events.ClientReady, () => pushCommands());
        else
            pushCommands();
    }
    async loadEvents(directory) {
        var _a;
        const files = (0, index_js_1.getAllFiles)(directory);
        if (!files.length)
            return;
        let loadedEvents = 0;
        for await (const file of files) {
            const { data: event } = (await (_a = file, Promise.resolve().then(() => __importStar(require(_a))))).default;
            const execute = (...args) => event?.execute(...args, this.client);
            if (event?.name !== null)
                event?.once ? this.client.once(event?.name, execute) : this.client.on(event?.name, execute);
            else if (event?.name === null && event?.restEvent)
                event?.once ? this.client.rest.once(event?.restEvent, execute) : this.client.rest.on(event?.restEvent, execute);
            else
                throw new TypeError(`Event ${file.split("/").at(-2)}/${file.split("/").at(-1)} has no event name`);
            loadedEvents++;
        }
        if (loadedEvents !== 0)
            this.client.logger.info("System", `Events Loaded : ${this.client.logger.highlight(loadedEvents.toString(), "success")}`);
    }
    async loadErelaEvents(directory) {
        var _a;
        const files = (0, index_js_1.getAllFiles)(directory);
        if (!files.length)
            return;
        let loadedEvents = 0;
        for await (const file of files) {
            const { data: event } = (await (_a = file, Promise.resolve().then(() => __importStar(require(_a))))).default;
            const execute = (...args) => event?.execute(...args, this.client);
            if (event?.name !== null)
                this.client.player.on(event?.name, execute);
            else
                throw new TypeError(`Event ${file.split("/").at(-2)}/${file.split("/").at(-1)} has no event name`);
            loadedEvents++;
        }
        if (loadedEvents !== 0)
            this.client.logger.info("System", `Erela Events Loaded : ${this.client.logger.highlight(loadedEvents.toString(), "success")}`);
    }
    catchErrors() {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(discord_js_1.Colors.Red)
            .setTimestamp();
        const logsChannelId = this.client.data.devBotEnabled ? this.client.data.dev.log.error : this.client.data.prod.log.error;
        process
            .on("uncaughtException", async (err) => {
            this.client.logger.error("System", `Uncaught Exception : ${err}`);
            const channel = await this.client.channels.fetch(logsChannelId).catch(() => { });
            if (!channel || channel.type !== discord_js_1.ChannelType.GuildText)
                return;
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
            if (!channel || channel.type !== discord_js_1.ChannelType.GuildText)
                return;
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
            .on("unhandledRejection", async (reason) => {
            this.client.logger.error("System", `Unhandled Rejection/Catch : ${reason}`);
            const channel = await this.client.channels.fetch(logsChannelId).catch(() => { });
            if (!channel || channel.type !== discord_js_1.ChannelType.GuildText)
                return;
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
exports.Handler = Handler;
