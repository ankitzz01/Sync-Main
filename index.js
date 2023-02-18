const { Client, Partials, Collection, EmbedBuilder, ActivityType } = require("discord.js")

const Spotify = require("erela.js-spotify")
const { AppleMusic } = require("better-erela.js-apple")
const Deezer = require("erela.js-deezer")
const filter = require("erela.js-filters")
const Facebook = require('erela.js-facebook')

const { loadEvents } = require("./Functions/loader/eventLoader")
const { loadPlayerEvents } = require("./Functions/loader/playerEventLoader")
const { loadCommands } = require("./Functions/loader/commandLoader")

const { Channel, GuildMember, Message, ThreadMember, User } = Partials

const nodes = require("./Systems/Nodes")
const { Manager } = require("erela.js")

const client = new Client({
    intents: 697,
    partials: [Channel, GuildMember, Message, ThreadMember, User],
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

    client.user.setActivity({

        name: `Music`,
        type: ActivityType.Playing,
    
    })

}).catch((err) => console.log(err))

//test: MTA3NDY0NDMxMTUzMjEyMjEyMg.GgQyt6.KaLKsOW-fAfgTRooa5Xe9RAUDQlYOSUG2T8-dU
//original: MTA1MDcyNTQwMzI3NjM1MzU1Nw.GY7AZ0.l6hBhk2U3PXiRLGhNM022Ad4GSZ4Zb2q-c1o4E