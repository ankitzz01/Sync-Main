import { ChannelType, EmbedBuilder, BaseGuildTextChannel, PermissionsBitField } from "discord.js"
import { Player } from "erela.js"
import { CustomClient, msToTimestamp, PlayerEvent } from "../../structure/index.js"
import buttonDB from "../../schemas/tempbutton.js"
import wait from "node:timers/promises"
import setupDB, { MusicChannelSchema } from "../../schemas/musicchannel.js"
import { musicSetupUpdate } from "../../structure/functions/setupUpdate.js"
import { buttonEnable } from "../../systems/button.js"

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
    name: "trackStart",
    async execute(player: Player, track: TrackOptions, type: any, client: CustomClient) {

        if (!player.textChannel) return

        const Channel = await client.channels.fetch(player.textChannel).catch(() => { }) as BaseGuildTextChannel
        if (!Channel) return
        if (Channel.type !== ChannelType.GuildText) return
        if (!Channel.guild?.members.me?.permissions.has(PermissionsBitField.Flags.SendMessages)) return

        let link = `https://www.google.com/search?q=${encodeURIComponent(track.title)}`

        const cdata = await setupDB.findOne<MusicChannelSchema>({ Guild: player.guild, Channel: player.textChannel })

        const setupUpdateEmbed = new EmbedBuilder()
            .setColor(client.data.color)
            .setAuthor({ name: "NOW PLAYING", iconURL: track.requester.displayAvatarURL() })
            .setDescription(`[\`\`${track.title}\`\`](${link})`)
            .addFields(
                { name: 'Requested by', value: `<@${track.requester.id}>`, inline: true },
                { name: 'Song by', value: `\`${track.author}\``, inline: true },
                { name: 'Duration', value: `\`❯ ${msToTimestamp(track.duration)}\``, inline: true },
            )
            .setImage(`${track.displayThumbnail("maxresdefault") || client.data.links.background}`)

        if (cdata) {
            await musicSetupUpdate(client, player, setupDB, setupUpdateEmbed)
        } else {
            let msg = await Channel.send({
                embeds: [new EmbedBuilder()
                    .setColor("Blue")
                    .setAuthor({ name: "NOW PLAYING", iconURL: track.requester.displayAvatarURL(), url: client.data.links.invite })
                    .setDescription(`[\`\`${track.title}\`\`](${link})`)
                    .addFields(
                        { name: 'Requested by', value: `\`${track.requester.username}\``, inline: true },
                        { name: 'Song by', value: `\`${track.author}\``, inline: true },
                        { name: 'Duration', value: `\`❯ ${msToTimestamp(track.duration)}\``, inline: true })],
                components: [buttonEnable]
            }).catch((err: Error) => { 
                if (err) return
            })
            await musicSetupUpdate(client, player, setupDB, setupUpdateEmbed)
            if (!msg || !msg.id) return
            const data = new buttonDB({
                Guild: player.guild,
                Channel: player.textChannel,
                MessageID: msg.id
            })
            await wait.setTimeout(2000)
            await data.save()
        }
    }
})