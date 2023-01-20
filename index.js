const { Client, Partials, Collection } = require("discord.js")
const { promisify } = require("util")
const { glob } = require("glob")
const PG = promisify(glob)
const Ascii = require("ascii-table")
const Spotify = require("erela.js-spotify")
const { AppleMusic } = require("better-erela.js-apple")
const Deezer = require("erela.js-deezer")
const filter = require("erela.js-filters")
const Facebook = require('erela.js-facebook')

const { Channel, GuildMember, Message, ThreadMember, User, GuildScheduledEvent } = Partials

const nodes = require("./Systems/Nodes")
const { Manager } = require("erela.js")

const client = new Client({
    intents: 131071,
    partials: [Channel, GuildMember, Message, ThreadMember, User, GuildScheduledEvent],
    allowedMentions: { parse: ["everyone", "roles", "users"] },
    rest: { timeout: 1000 * 60 }
})

client.events = new Collection()
client.commands = new Collection()
client.config = require("./config.json")
client.color = "#009FFE"

const clientID = client.config.spotifyId
const clientSecret = client.config.spotifySecret

client.player = new Manager({
    nodes,
    send: (id, payload) => {

        let guild = client.guilds.cache.get(id)
        if (guild) guild.shard.send(payload)

    },
    plugins: [
        new Spotify({ clientID, clientSecret }),
        new AppleMusic(),
        new Deezer(),
        new filter(),
        new Facebook()
    ]
})

client.on("raw", (d) => client.player.updateVoiceState(d))

const Handlers = ["Events", "Commands", "Errors", "Player"]

Handlers.forEach(handler => {

    require(`./Structures/Handlers/${handler}`)(client, PG, Ascii)

})

module.exports = client

client.login(client.config.token)