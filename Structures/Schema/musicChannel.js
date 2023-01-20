const { model, Schema } = require("mongoose")

module.exports = model("musicChannel", new Schema({

    Guild: String,
    Channel: String
    
}))