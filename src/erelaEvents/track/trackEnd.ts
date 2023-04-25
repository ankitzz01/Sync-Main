import { ChannelType, Channel, BaseGuildTextChannel } from "discord.js"
import { Player } from "erela.js";
import db, { PlayedSchema } from "../../schemas/played.js";
import buttonDB, { TempButtonSchema } from "../../schemas/tempbutton.js";
import { buttonDisable } from "../../systems/button.js";
import { CustomClient, PlayerEvent } from "../../structure/index"

interface TrackOptions {
    /** The base64 encoded track. */
    readonly track: string;
    /** The title of the track. */
    readonly title: string;
    /** The identifier of the track. */
    readonly identifier: string;
    /** The author of the track. */
    readonly author: string;
    /** The duration of the track. */
    readonly duration: number;
    /** If the track is seekable. */
    readonly isSeekable: boolean;
    /** If the track is a stream.. */
    readonly isStream: boolean;
    /** The uri of the track. */
    readonly uri: string;
    /** The thumbnail of the track or null if it's a unsupported source. */
    readonly thumbnail: string | null;
    /** The user that requested the track. */
    readonly requester: unknown | null | any;
    /** Displays the track thumbnail with optional size or null if it's a unsupported source. */
    displayThumbnail(size?: Sizes): string;
}

declare type Sizes = "0" | "1" | "2" | "3" | "default" | "mqdefault" | "hqdefault" | "maxresdefault";

export default new PlayerEvent({
    name: "trackEnd",
    async execute(player: Player, track: TrackOptions, type: any, client: CustomClient) {

        if (!track.requester) return

        let data = await db.findOne<PlayedSchema>({ User: track.requester.id }).catch(() => { })

        if (!data) {
            data = new db({
                User: track.requester.id,
                Played: 1,
                Time: Number(track.duration)
            })

            await data.save()
        } else {
            data.Played += 1
            data.Time += Number(track.duration)

            await data.save()
        }

        if (player.textChannel === null) return

        const Channel = await client.channels.fetch(player.textChannel).catch(() => { })
        if (!Channel) return
        if (Channel.type !== ChannelType.GuildText) return

        const bdata = await buttonDB.find<TempButtonSchema>({ Guild: player.guild, Channel: player.textChannel })

        for (let i = 0; i < bdata.length; i++) {
            const msg = await (Channel as BaseGuildTextChannel).messages?.fetch(bdata[i].MessageID).catch(() => { })

            if (msg && msg.editable) await msg.edit({ components: [buttonDisable] }).catch(() => { })

            await bdata[i].delete()
        }

    }

})