"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const structure_1 = require("../../structure");
exports.default = new structure_1.SlashCommand({
    data: new discord_js_1.SlashCommandBuilder()
        .setName('grab')
        .setDescription('Sends the current playing song to your DM'),
    category: "Music",
    async execute(interaction, client) {
        if (await (0, structure_1.botVC)(interaction))
            return;
        if (await (0, structure_1.memberVoice)(interaction))
            return;
        if (await (0, structure_1.differentVoice)(interaction))
            return;
        const player = client.player.players.get(interaction.guild?.id);
        if (!player)
            return (0, structure_1.reply)(interaction, "❌", "No song player was found", true);
        if (!(player.playing || player.paused || player.queue.current))
            return interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder()
                        .setColor("DarkRed")
                        .setDescription("No song was found playing")
                ], ephemeral: true
            });
        await interaction.deferReply({ ephemeral: true });
        const track = player.queue.current;
        const link = `https://www.google.com/search?q=${encodeURIComponent(track.title)}`;
        const Embed = new discord_js_1.EmbedBuilder()
            .setColor(client.data.color)
            .setAuthor({ name: "SAVED SONG", iconURL: track.requester.displayAvatarURL(), url: client.data.links.support })
            .setDescription(`[\`\`${track.title}\`\`](${link})`)
            .addFields({ name: 'Song by', value: `\`${track.author}\``, inline: true }, { name: 'Duration', value: `\`❯ ${(0, structure_1.msToTimestamp)(track.duration)}\``, inline: true })
            .setImage(`${track.displayThumbnail("maxresdefault") || client.data.links.background}`)
            .setFooter({ text: `${interaction.guild?.name}`, iconURL: interaction.guild?.iconURL() })
            .setTimestamp();
        await interaction.member.send({ embeds: [Embed] }).catch(() => {
            return (0, structure_1.editReply)(interaction, "❌", "Unable to send the song. Check if you have your DMs open");
        });
        return (0, structure_1.editReply)(interaction, "✅", "The Song has been sent in your DMs!");
    }
});
