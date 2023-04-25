import { Client, Collection } from "discord.js";
import mongoose from "mongoose";
import { ClientDataOptions, CustomClientOptions, BaseApplicationCommand } from "../interfaces/index.js";
import { Handler } from "./index.js";
import { Logger } from "./Logger.js";
import nodes from "../../systems/nodes.js";
import { Manager } from "erela.js";
import Spotify from "erela.js-spotify";
import Deezer from "erela.js-deezer";
import Facebook from "erela.js-facebook";
import Filters from "erela.js-filters";
import { AppleMusic } from "better-erela.js-apple";
import client from "../../index.js";
import config from "../../config.js";

const clientID: string = config.spotify.id
const clientSecret: string = config.spotify.secret

export class CustomClient extends Client {
    commands: Collection<string, BaseApplicationCommand> = new Collection()
    data: ClientDataOptions
    handlers: Handler = new Handler(this)
    logger: Logger = new Logger()
    constructor(options: CustomClientOptions) {
        super(options)
        this.data = options.data
        this.setMaxListeners(20)
    }

    color: string = "#009FFE"

    player = new Manager({
        nodes,
        send: async (id, payload) => {

            let guild = await this.guilds.fetch(id)
            if (guild) guild.shard.send(payload)

        },
        plugins: [
            new Spotify({ clientID, clientSecret }),
            new AppleMusic(),
            new Deezer(),
            new Filters(),
            new Facebook()
        ]
    })

    async start() {
        client.on("raw", (d) => client.player.updateVoiceState(d))

        await this.login(this.data.devBotEnabled ? this.data.dev.token : this.data.prod.token);

        this.handlers.catchErrors();
        this.handlers.loadEvents(this.data.handlers.events);
        this.handlers.loadCommands(this.data.handlers.commands);
        this.handlers.loadErelaEvents(this.data.handlers.erelaEvents);

        mongoose.set("strictQuery", false);
        mongoose.connect(this.data.devBotEnabled ? this.data.dev.db : this.data.prod.db)
            .then((data) => {
                this.logger.info("Database", "Connected to : " + this.logger.highlight(data.connection.name, "success"));
            })
            .catch(() => {
                this.logger.error("Database", "Error Connecting to Database!");
            });
    }
}