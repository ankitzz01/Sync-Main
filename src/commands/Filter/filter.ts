import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { botVC, memberVoice, differentVoice, SlashCommand, reply, editReply } from "../../structure/index.js"

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName("filter")
        .setDescription("filter")
        .addSubcommand(sub =>
            sub.setName('nightcore')
                .setDescription('Applies a nightcore filter'))
        .addSubcommand(sub =>
            sub.setName('vaporwave')
                .setDescription('Applies a vaporwave filter'))
        .addSubcommand(sub =>
            sub.setName('bassboost')
                .setDescription('Applies a bassboost filter'))
        .addSubcommand(sub =>
            sub.setName('pop')
                .setDescription('Applies a pop filter'))
        .addSubcommand(sub =>
            sub.setName('soft')
                .setDescription('Applies a soft filter'))
        .addSubcommand(sub =>
            sub.setName('treblebass')
                .setDescription('Applies a treblebass filter'))
        .addSubcommand(sub =>
            sub.setName('8d')
                .setDescription('Applies a 8D filter'))
        .addSubcommand(sub =>
            sub.setName('karaoke')
                .setDescription('Applies a karaoke filter'))
        .addSubcommand(sub =>
            sub.setName('vibrato')
                .setDescription('Applies a vibrato filter'))
        .addSubcommand(sub =>
            sub.setName('tremolo')
                .setDescription('Applies a tremolo filter'))
        .addSubcommand(sub =>
            sub.setName('clear')
                .setDescription('Clears the applied filter')),
    category: "Filter",
    async execute(interaction, client) {

        if (await botVC(interaction)) return
        if (await memberVoice(interaction)) return
        if (await differentVoice(interaction)) return

        const player = client.player.players.get(interaction.guild?.id as string)
        if (!player) return reply(interaction, "❌", "No song player was found", true)
        if (!player.playing) return reply(interaction, "❌", "No song was found playing", true)

        await interaction.deferReply()

        switch (interaction.options.getSubcommand()) {

            case "nightcore": {

                (player as any).nightcore = true

                editReply(interaction, "✅", `Successfully applied the **${interaction.options.getSubcommand()}** filter`)

            }
                break;
            case "vaporwave": {

                (player as any).vaporwave = true

                editReply(interaction, "✅", `Successfully applied the **${interaction.options.getSubcommand()}** filter`)

            }
                break;
            case "bassboost": {

                (player as any).bassboost = true

                editReply(interaction, "✅", `Successfully applied the **${interaction.options.getSubcommand()}** filter`)

            }
                break;
            case "pop": {

                (player as any).pop = true

                editReply(interaction, "✅", `Successfully applied the **${interaction.options.getSubcommand()}** filter`)

            }
                break;
            case "soft": {

                (player as any).soft = true

                editReply(interaction, "✅", `Successfully applied the **${interaction.options.getSubcommand()}** filter`)

            }
                break;
            case "treblebass": {

                (player as any).treblebass = true

                editReply(interaction, "✅", `Successfully applied the **${interaction.options.getSubcommand()}** filter`)

            }
                break;
            case "8d": {

                (player as any).eightd = true

                editReply(interaction, "✅", `Successfully applied the **${interaction.options.getSubcommand()}** filter`)

            }
                break;
            case "karaoke": {

                (player as any).karaoke = true

                editReply(interaction, "✅", `Successfully applied the **${interaction.options.getSubcommand()}** filter`)

            }
                break;
            case "vibrato": {

                (player as any).vibrato = true

                editReply(interaction, "✅", `Successfully applied the **${interaction.options.getSubcommand()}** filter`)

            }
                break;
            case "tremolo": {

                (player as any).tremolo = true

                editReply(interaction, "✅", `Successfully applied the **${interaction.options.getSubcommand()}** filter`)

            }
                break;

            case "clear": {

                await (player as any).reset()

                editReply(interaction, "✅", "Successfully cleared the filters")

            }
                break;
        }

    }
})