import { CustomClient, Event } from "../../structure/index.js";
import { AutocompleteInteraction, Events } from "discord.js";
import yt, { Video } from "youtube-sr";
import PlaylistDB, { PlaylistSchema } from "../../schemas/playlist.js";

export default new Event({
    name: Events.InteractionCreate,

    async execute(interaction: AutocompleteInteraction, client: CustomClient) {

        if (!interaction.isAutocomplete()) return

        switch (interaction.commandName) {
            case "play": {
                const query = interaction.options?.getString('query')
                if (!query) return
                if (query.length <= 1) return

                let choices: any[] = []

                const searched = await yt.search(query, {
                    limit: 4,
                    type: 'video'
                })

                const filtered = searched.filter(m => m.private === false)

                filtered.forEach((x: Video) => {
                    choices.push({
                        name: x.title?.slice(0, 100),
                        value: x.url
                    })
                })

                await interaction.respond(choices).catch(() => { })
            }
                break;

            case "playlist": {

                const playlist = interaction.options?.getString('playlist')
                if (!playlist) return

                const data = await PlaylistDB.findOne<PlaylistSchema>({ User: interaction.user.id }).catch(err => { })

                if(!data || !data.Playlist || data.Playlist.length < 1) return

                let choices: any[] = []

                const searched = data.Playlist

                searched.forEach(x => {
                    choices.push({
                        name: x.name,
                        value: x.name
                    })
                })

                await interaction.respond(choices).catch(() => { })

            }
                break;

        }
    },
})