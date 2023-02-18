const { Client, ActivityType, Events } = require("discord.js")
const mongoose = require("mongoose")
const c = require("colors")

module.exports = {
    name: Events.ClientReady,

    /**
    * @param {Client} client
    */
   
    async execute(client) {

        const mongoURL = client.config.mongo

        const { user } = client

        client.player.init(user.id)

        console.log(`${user.tag} is now online!`.green)

        mongoose.set('strictQuery', false)

        if (!mongoURL) return
        mongoose.connect(mongoURL, {

            useNewUrlParser: true,
            useUnifiedTopology: true

        }).then(() => {

            console.log("Connected to the database".blue)
        }).catch(err => console.log(err))
    }
}