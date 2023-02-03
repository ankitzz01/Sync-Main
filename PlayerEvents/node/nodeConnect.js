const { Client } = require("discord.js")
const { Node } = require("erela.js")

module.exports = {
    name: "nodeConnect",

    /**
     * @param { Node } node
     * @param { Client } client
     */
    async execute(node, client) {

        console.log(`Node ${node.options.name} connected`)

    }
}