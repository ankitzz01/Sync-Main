const { ButtonInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder,TextInputBuilder, TextInputStyle, ModalBuilder} = require("discord.js")
const Pagination = require("../../Systems/Pagination")

module.exports = {
    name: "interactionCreate",

    /**
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (!interaction.isButton()) return
        if (!["owner-leave", "owner-servers", "owner-eval"].includes(interaction.customId)) return

        const embed = new EmbedBuilder()
            .setColor("DarkRed")

        if (interaction.user.id !== client.config.owner) return interaction.reply({
            embeds: [embed.setDescription(`You cannot use this buttons`)], ephemeral: true
        })

        switch (interaction.customId) {

            case "owner-servers": {

                await interaction.deferReply({ephemeral: true})

                let servers = ""
                client.guilds.cache.forEach((guild) => {
                    servers += `Name: ${guild.name} | ID: ${guild.id}\n${guild.memberCount} Members | Owner: ${guild.ownerId}\n\n`
                })

                const LIST = new EmbedBuilder()
                    .setAuthor({ name: `${client.user.username} is in ${client.guilds.cache.size} server`, iconURL: client.user.displayAvatarURL() })
                    .setColor("DarkRed")
                    .setDescription(`\`\`\`${servers}\`\`\``)
                interaction.editReply({ embeds: [LIST] })
            }
                break;

            case "owner-leave": {

                const modal = new ModalBuilder()
                    .setCustomId("owner-leave-modal")
                    .setTitle("Guild Leave")

                const guildId = new TextInputBuilder()
                    .setCustomId("owner-leave-modal-guildId")
                    .setLabel("GUILD ID")
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("Enter the Guild ID to leave")
                    .setRequired(true)

                const RowTop = new ActionRowBuilder().addComponents(guildId)

                modal.addComponents(RowTop)

                await interaction.showModal(modal)
            }
                break;

            case "owner-eval": {

                const modal = new ModalBuilder()
                    .setCustomId("owner-eval-modal")
                    .setTitle("Eval")

                const code = new TextInputBuilder()
                    .setCustomId("owner-eval-modal-code")
                    .setLabel("CODE")
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("Enter the code to eval")
                    .setRequired(true)

                const RowTop = new ActionRowBuilder().addComponents(code)

                modal.addComponents(RowTop)

                await interaction.showModal(modal)

            }

                break;
        }
    },
}