const { model, Schema } = require("mongoose")

module.exports = model("songsPlayed", new Schema({

    User: String,
    Played: Number,
    Time: Number
    
}))