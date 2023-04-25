"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const structure_1 = require("../../structure");
exports.default = new structure_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName('now-playing')
        .setDescription('See the current playing song'),
    category: "Music",
    async execute(interaction, client) {
        const Manager = client.player;
        const player = Manager.players.get(interaction.guild?.id);
        if (await (0, structure_1.botVC)(interaction))
            return;
        if (await (0, structure_1.memberVoice)(interaction))
            return;
        if (await (0, structure_1.differentVoice)(interaction))
            return;
        if (!player)
            return interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder()
                        .setColor("DarkRed")
                        .setDescription("No song player was found")
                ], ephemeral: true
            });
        if (!(player.playing || player.paused || player.queue.current))
            return interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder()
                        .setColor("DarkRed")
                        .setDescription("No song was found playing")
                ], ephemeral: true
            });
        await interaction.deferReply();
        const track = player.queue.current;
        let link = `https://www.google.com/search?q=${encodeURIComponent(track.title)}`;
        const Embed = new discord_js_1.EmbedBuilder()
            .setColor(client.data.color)
            .setAuthor({ name: "NOW PLAYING", iconURL: track.requester.displayAvatarURL() })
            .setDescription(`[\`\`${track?.title}\`\`](${link})`)
            .addFields({ name: 'Requested by', value: `<@${track.requester.id}>`, inline: true }, { name: 'Song by', value: `\`${track.author}\``, inline: true }, { name: 'Duration', value: `\`❯ ${(0, structure_1.msToTimestamp)(track.duration)}\``, inline: true })
            .setImage(`${track.displayThumbnail("maxresdefault") || client.data.links.background}`);
        return interaction.editReply({ embeds: [Embed] });
    }
});
