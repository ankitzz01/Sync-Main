"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomClient = void 0;
const discord_js_1 = require("discord.js");
const mongoose_1 = __importDefault(require("mongoose"));
const index_js_1 = require("./index.js");
const Logger_js_1 = require("./Logger.js");
const nodes_js_1 = __importDefault(require("../../systems/nodes.js"));
const erela_js_1 = require("erela.js");
const erela_js_spotify_1 = __importDefault(require("erela.js-spotify"));
const erela_js_deezer_1 = __importDefault(require("erela.js-deezer"));
const erela_js_facebook_1 = __importDefault(require("erela.js-facebook"));
const erela_js_filters_1 = __importDefault(require("erela.js-filters"));
const better_erela_js_apple_1 = require("better-erela.js-apple");
const index_js_2 = __importDefault(require("../../index.js"));
const config_js_1 = __importDefault(require("../../config.js"));
const clientID = config_js_1.default.spotify.id;
const clientSecret = config_js_1.default.spotify.secret;
class CustomClient extends discord_js_1.Client {
    commands = new discord_js_1.Collection();
    data;
    handlers = new index_js_1.Handler(this);
    logger = new Logger_js_1.Logger();
    constructor(options) {
        super(options);
        this.data = options.data;
        this.setMaxListeners(20);
    }
    color = "#009FFE";
    player = new erela_js_1.Manager({
        nodes: nodes_js_1.default,
        send: async (id, payload) => {
            let guild = await this.guilds.fetch(id);
            if (guild)
                guild.shard.send(payload);
        },
        plugins: [
            new erela_js_spotify_1.default({ clientID, clientSecret }),
            new better_erela_js_apple_1.AppleMusic(),
            new erela_js_deezer_1.default({}),
            new erela_js_filters_1.default(),
            new erela_js_facebook_1.default()
        ]
    });
    async start() {
        index_js_2.default.on("raw", (d) => index_js_2.default.player.updateVoiceState(d));
        await this.login(this.data.devBotEnabled ? this.data.dev.token : this.data.prod.token);
        this.handlers.catchErrors();
        this.handlers.loadEvents(this.data.handlers.events);
        this.handlers.loadCommands(this.data.handlers.commands);
        this.handlers.loadErelaEvents(this.data.handlers.erelaEvents);
        mongoose_1.default.set("strictQuery", false);
        mongoose_1.default.connect(this.data.devBotEnabled ? this.data.dev.db : this.data.prod.db)
            .then((data) => {
            this.logger.info("Database", "Connected to : " + this.logger.highlight(data.connection.name, "success"));
        })
            .catch(() => {
            this.logger.error("Database", "Error Connecting to Database!");
        });
    }
}
exports.CustomClient = CustomClient;
