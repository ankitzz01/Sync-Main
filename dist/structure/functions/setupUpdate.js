"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.musicSetupUpdate = void 0;
async function musicSetupUpdate(client, player, DB, Embed) {
    const data = await DB.findOne({ Guild: player.guild });
    if (!data)
        return;
    const Channel = await client.channels.fetch(data.Channel).catch(() => { });
    if (!Channel)
        return;
    const msg = await Channel.messages.fetch(data.Message).catch(() => { });
    if (!msg || !msg?.editable)
        return;
    await msg.edit({ embeds: [Embed] }).catch(err => { });
}
exports.musicSetupUpdate = musicSetupUpdate;
