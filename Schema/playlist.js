const { model, Schema } = require("mongoose")

module.exports = model("playlist", new Schema({

    User: String,
    Playlist: [{ name: String, songs: [String], private: Boolean, created: Number }],

}))