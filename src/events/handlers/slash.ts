import { ChatInputCommandInteraction, Events, InteractionType, EmbedBuilder } from "discord.js";
import { Event, CustomClient, reply } from "../../structure/index.js";
import { log } from "../../structure/index.js";
import { Api } from '@top-gg/sdk'

export default new Event({
    name: Events.InteractionCreate,
    async execute(interaction: ChatInputCommandInteraction, client: CustomClient) {
        if (interaction.type !== InteractionType.ApplicationCommand) return;
        const command = client.commands.get(interaction.commandName);
        await client.application?.fetch().catch(() => { });

        if (!command) {
            reply(interaction, "❌", "This command does not exist")

            return client.commands.delete(interaction.commandName)
        }

        if (command.botOwnerOnly && !client.data.developers.includes(interaction.user.id)) return reply(
            interaction, "❌", "This command is only available for bot developers"
        );

        const topgg = new Api(client.data.topgg.token)
        if (command.voteOnly && !(await topgg.hasVoted(interaction.user.id))) return reply(
            interaction, "❌", `You must vote me on [top.gg](${client.data.topgg.vote}) before using this command`
        )

        command.execute(interaction, client)

        const Embed = new EmbedBuilder()
            .setColor("DarkBlue")
            .setAuthor({ name: `${interaction.guild?.name}`, iconURL: interaction.guild?.iconURL() || client.user?.displayAvatarURL() })
            .setDescription(`\`\`\`Used In: ${interaction.guild?.name} (${interaction.guild?.id})\
        \nCommand Used: ${interaction.commandName} (${interaction.commandId})\
        \nUsed by: ${interaction.user.username} (${interaction.user.id})\`\`\``)

        log(client, Embed, client.data.devBotEnabled ? client.data.dev.log.command : client.data.prod.log.command);
    }
});