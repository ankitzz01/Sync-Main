import { ColorResolvable } from 'discord.js'

export default {
    
    dev: {
        id: "",
        secret: "",
        token: "",
        db: "",
        log: {
            error: "",
            guild: "",
            command: ""
        },
        webhook: {
            command: "",
            guild: "",
            error: ""
        },
    },
    prod: {
        id: "",
        secret: "",
        token: "",
        db: "",
        log: {
            error: "",
            guild: "",
            command: ""
        },
        webhook: {
            command: "",
            guild: "",
            error: ""
        },
    },
    links: {
        invite: "",
        support: "",
        background: ""
    },
    topgg: {
        token: "",
        vote: ""
    },
    spotify: {
        id: "",
        secret: "",
    },
    handlers: {commands: "./dist/commands", events: "./dist/events", erelaEvents: "./dist/erelaEvents"},
    guilds: {
        dev: [""]
    },
    color: "Blue" as ColorResolvable,
    developers: [""]
}
