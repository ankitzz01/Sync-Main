const { model, Schema } = require("mongoose")

module.exports = model("buttonRemove", new Schema({

    Guild: String,
    Channel: String,
    MessageID: String
    
}))