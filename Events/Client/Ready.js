const { Client, ActivityType } = require("discord.js")
const mongoose = require("mongoose")

module.exports = {
    name: "ready",

    /**
    * @param {Client} client
    */
    async execute(client) {

        const mongoURL = client.config.mongo

        const { user } = client

        client.player.init(user.id)

        console.log(`${user.tag} is now online!`)

        user.setActivity({
            name: `Music`,
            type: ActivityType.Listening,
        })

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