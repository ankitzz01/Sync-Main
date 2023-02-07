const { Client, AutocompleteInteraction, Events } = require("discord.js")
const yt = require("youtube-sr").default

module.exports = {
    name: Events.InteractionCreate,
    /**
     * @param {AutocompleteInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {

        if (!interaction.isAutocomplete()) return

        const { commandName, options } = interaction

        switch (commandName) {
            case "play": {
                const query = options.getString('query')

                if (query.length <= 1) return

                let choices = []

                const searched = await yt.search(query, {
                    limit: 4,
                    type: 'video'
                })

                const filtered = searched.filter(m => m.private === false)

                filtered.forEach(x => {
                    choices.push({
                        name: x.title.slice(0, 100),
                        value: x.url
                    })
                })

                await interaction.respond(choices)
            }
                break;

        }
    },
}