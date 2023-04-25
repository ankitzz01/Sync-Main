import { CustomClient } from "./structure/index.js";
import config from "./config.js";
import { Partials } from "discord.js";

const client = new CustomClient({
    data: {
        ...config,
        devBotEnabled: true
    },
    intents: [697],

    partials: [
        Partials.Message,
        Partials.User,
        Partials.ThreadMember,
        Partials.GuildMember,
        Partials.Channel
    ],

    allowedMentions: { parse: ["everyone", "roles", "users"] }

});

export default client;

client.start();