import { Events, GuildMember, VoiceState } from "discord.js";
import { CustomClient, Event } from "../../structure/index.js";
import { BaseGuildTextChannel, EmbedBuilder } from "discord.js";
import buttonDB, { TempButtonSchema } from "../../schemas/tempbutton";
import { buttonDisable } from "../../systems/button";

export default new Event({
    name: Events.VoiceStateUpdate,
    async execute(oldState: VoiceState, newState: VoiceState, client: CustomClient) {
        // checks if someone left the vc
        if (oldState.channelId && !newState.channelId) {
            const botVoiceState = (oldState.guild.members.me as GuildMember).voice;
            if (!botVoiceState.channel) return

            const player = client.player.players.get(oldState.guild?.id as string)
            if (!player) return

            if (botVoiceState.channel.members.filter((m) => !m.user.bot).size < 1) {
                const timeout = setTimeout(async () => {

                    player.disconnect()

                    const channel = await oldState.guild.channels.fetch(player.textChannel as string) as BaseGuildTextChannel
                    player.destroy()

                    if(!channel) return
                    await channel.send({ embeds: [new EmbedBuilder()
                                .setAuthor({
                                    name: "Left the VC because of inactivity exceeding 5 minutes",
                                    iconURL: client.user?.displayAvatarURL()
                                })
                                .setColor(client.data.color)
                        ]
                    }).catch(() => { })

                    const data = await buttonDB.find<TempButtonSchema>({ Guild: player.guild, Channel: player.textChannel })
                    for (let i = 0; i < data.length; i++) {
                        const msg = await channel.messages.fetch(data[i].MessageID)

                        if (msg && msg.editable) await msg.edit({ components: [buttonDisable] })
                        if (data && data[i]) await data[i].delete()
                    }
                }, 1000 * 60 * 5); // 1000 * 60 * 5 = 5 mins
                (botVoiceState as any).channel.timeout = timeout;
            }
        }

        // Check if someone joined a voice channel
        if (!oldState.channelId && newState.channelId) {
            const botVoiceState = (newState.guild.members.me as GuildMember).voice;
            if (!botVoiceState.channel) return

            if (botVoiceState.channel.id === newState.channelId) {
                if ((botVoiceState as any).channel.timeout) {
                    clearTimeout((botVoiceState as any).channel.timeout);
                    (botVoiceState as any).channel.timeout = null;
                }
            }
        }
    },
})