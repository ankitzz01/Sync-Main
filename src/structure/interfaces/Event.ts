import { ClientEvents, RestEvents } from "discord.js";

export class Event {
    public data: EventOptions;
    constructor (options: EventOptions) {
        this.data = options;
    }
}

export interface EventOptions {
    name: keyof ClientEvents | null;
    restEvent?: keyof RestEvents;
    once?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute: (...args: any[]) => any;
}