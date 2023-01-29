const { Client, ActivityType } = require("discord.js")
const mongoose = require("mongoose")

module.exports = {
    name: "ready",

    /**
    * @param {Client} client
    */
    async execute(client) {

        const mongoURL = client.config.mongo

        const { user, guilds, users } = client

        client.player.init(user.id)

        console.log(`${user.tag} is now online!`)

        const activity = [
            {
                name: `${guilds.cache.size} guilds`,
                type: ActivityType.Watching,
            },
            {
                name: `${users.cache.size} users`,
                type: ActivityType.Watching,
            }
        ]

        setInterval(() => {

            let random = Math.random()

            user.setActivity(

                activity[random]

            )

        }, 1000 * 60 * 10)

        mongoose.set('strictQuery', true)

        if (!mongoURL) return
        mongoose.connect(mongoURL, {

            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {

            console.log("Connected to the database")
        }).catch(err => console.log(err))
    }
}