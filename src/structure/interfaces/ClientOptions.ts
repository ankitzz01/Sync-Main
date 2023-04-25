import { ClientOptions, ColorResolvable } from "discord.js";

export interface CustomClientOptions extends ClientOptions {
    data: ClientDataOptions;
}

export interface ClientDataOptions {
    dev: {
        id: string;
        secret: string;
        token: string;
        db: string;
        log: {
            error: string;
            guild: string;
            command: string;
        }
    }
    prod: {
        id: string;
        secret: string;
        token: string;
        db: string;
        log: {
            error: string;
            guild: string;
            command: string;
        }
    }
    links: {
        topgg: string;
        invite: string;
        support: string;
        background: string;
    }
    spotify: {
        secret: string;
        id: string;
    }
    handlers: { commands: string, events: string, erelaEvents: string };
    guilds: {
        dev: string[];
    };
    color: ColorResolvable;
    devBotEnabled: boolean;
    developers: string[]
}