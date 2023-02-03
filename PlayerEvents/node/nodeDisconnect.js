const { Client } = require("discord.js")
const { Node } = require("erela.js")

module.exports = {
    name: "nodeDisconnect",

    /**
     * @param { Node } node
     * @param { Client } client
     */
    async execute(node, client) {

        console.log(`Node ${node.options.name} disconnected`)

    }
}