const {EmbedBuilder} = require("discord.js")

function EditReply(interaction ,emoji ,description, type, color){

    const COLOR = color || "Blue"

    interaction.editReply({
        embeds: [
            new EmbedBuilder()

            .setDescription(`\`${emoji}\` | ${description}`)
            .setColor(COLOR)

        ],
    })
}

module.exports = EditReply