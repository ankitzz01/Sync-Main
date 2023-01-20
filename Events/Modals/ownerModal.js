const { Client, ModalSubmitInteraction, InteractionType, EmbedBuilder } = require("discord.js")

module.exports = {
    name: "interactionCreate",

    /**
     * @param {ModalSubmitInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        const { type, customId, guild, user, fields } = interaction

        if (type !== InteractionType.ModalSubmit) return
        if (!guild || user.bot) return

        if (!["owner-leave-modal", "owner-eval-modal"].includes(customId)) return

        await interaction.deferReply({ ephemeral: true })

        switch (customId) {

            case "owner-leave-modal": {

                const id = fields.getTextInputValue("owner-leave-modal-guildId")

                const Guild = client.guilds.cache.get(id)

                if (!Guild) return interaction.editReply({ content: "NO GUILD WAS FOUND WITH THAT ID" })

                const Embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle(`Left ${Guild.name}`)
                    .setDescription(`\`\`\`Successfully left the guild\nOwner ID: ${Guild.ownerId}\nMember Count: ${Guild.memberCount}\`\`\``)
                    .setThumbnail(Guild.iconURL())
                    .setTimestamp()

                await Guild.leave()

                interaction.editReply({
                    embeds: [Embed],
                })

            }
                break;

            case "owner-eval-modal": {

                const code = fields.getTextInputValue("owner-eval-modal-code")

                try {
                    var result = eval(code)
                    
                } catch (error) {
                    return interaction.editReply("THE CODE CAN'T BE EVALED")
                }

                if (!result) return interaction.editReply("THE CODE CAN'T BE EVALED")

                const Embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(`\`\`\`${result.toString()}\`\`\``)
                    .setTitle("__EVALED CODE__")
                    .setFooter({ text: "Eval" })
                    .setTimestamp()

                interaction.editReply({ embeds: [Embed] })

            }
                break;
        }
    }
}