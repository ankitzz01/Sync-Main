const { Client, Partials, Collection, EmbedBuilder } = require("discord.js")

const Spotify = require("erela.js-spotify")
const { AppleMusic } = require("better-erela.js-apple")
const Deezer = require("erela.js-deezer")
const filter = require("erela.js-filters")
const Facebook = require('erela.js-facebook')

const { loadEvents } = require("./Functions/loader/eventLoader")
const { loadPlayerEvents } = require("./Functions/loader/playerEventLoader")
const { loadCommands } = require("./Functions/loader/commandLoader")

const { Channel, GuildMember, Message, ThreadMember, User, GuildScheduledEvent } = Partials

const nodes = require("./Systems/Nodes")
const { Manager } = require("erela.js")

const client = new Client({
    intents: 131071,
    partials: [Channel, GuildMember, Message, ThreadMember, User, GuildScheduledEvent],
    allowedMentions: { parse: ["everyone", "roles", "users"] },
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

const Embed = new EmbedBuilder()
        .setColor("Red")
        .setTimestamp()

    process.on("unhandledRejection", (reason, p) => {

        console.log(reason, p)

        const Channel = client.channels.cache.get(client.config.errorLog)
        if (!Channel) return

        Channel.send({
            embeds: [
                Embed
                    .setDescription("**Unhandled Rejection/Catch:\n\n** ```" + reason + "```")
                    .setTitle(`⚠ | Error Encountered`)
            ]
        })

    })

    process.on("uncaughtException", (err, origin) => {

        console.log(err, origin)

        const Channel = client.channels.cache.get(client.config.errorLog)
        if (!Channel) return

        Channel.send({
            embeds: [
                Embed
                    .setDescription("**Uncaught Exception/Catch:\n\n** ```" + err + "\n\n" + origin.toString() + "```")
                    .setTitle(`⚠ | Error Encountered`)
            ]
        })

    })

    process.on("uncaughtExceptionMonitor", (err, origin) => {

        console.log(err, origin)

        const Channel = client.channels.cache.get(client.config.errorLog)
        if (!Channel) return

        Channel.send({
            embeds: [
                Embed
                    .setDescription("**Uncaught Exception/Catch (MONITOR):\n\n** ```" + err + "\n\n" + origin.toString() + "```")
                    .setTitle(`⚠ | Error Encountered`)
            ]
        })

    })

module.exports = client

client.login(client.config.token).then(() => {

    loadEvents(client)
    loadPlayerEvents(client)
    loadCommands(client)

}).catch((err) => console.log(err))