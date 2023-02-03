const { Client, ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder, ChannelType } = require("discord.js")
const DB = require("../../Schema/musicChannel")

module.exports = {
    name: "channel",
    description: "Setup the music requesting channel",
    category: "Others",
    UserPerms: ["ManageGuild"],
    options: [
        {
            name: "options",
            description: "Enable or disable the channel",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Enable",
                    value: "yes"
                },
                {
                    name: "Disable",
                    value: "no"
                }
            ]
        },
        {
            name: "channel",
            description: "Select the channel",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: false
        }
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options } = interaction

        const channel = options.getChannel("channel")

        const choice = options.getString("options")
        let data = await DB.findOne({ Guild: interaction.guild.id })

        switch (choice) {
            case "yes": {

                if (!channel) return interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor("DarkRed").setDescription(`A channel is required for this selection`)], ephemeral: true
                })

                await interaction.deferReply()

                if (!data) {
                    data = new DB({
                        Guild: interaction.guild.id,
                        Channel: channel.id
                    })

                    await data.save()
                } else {
                    data.Channel = channel.id

                    await data.save()
                }

                interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setColor(client.color).setDescription(`The music requesting channel has been set to ${channel}`)]
                })
            }
                break;

            case "no": {

                if (!data) return interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor("DarkRed").setDescription(`The music requesting channel is already disabled`)], ephemeral: true
                })

                else {

                    await interaction.deferReply()

                    await data.delete()

                    interaction.editReply({
                        embeds: [new EmbedBuilder()
                            .setColor("DarkRed").setDescription(`The music requesting channel has been **disabled**`)]
                    })
                }
            }
                break;
        }
    }

}