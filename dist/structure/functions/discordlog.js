"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
async function log(client, embed, channelId) {
    const Channel = await client.channels.fetch(channelId).catch(() => { });
    if (!Channel)
        return;
    return await Channel.send({ embeds: [embed] });
}
exports.log = log;
