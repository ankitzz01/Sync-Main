const {EmbedBuilder} = require("discord.js")

function Reply(interaction ,emoji ,description ,type, color){

    const COLOR = color || "Blue"

    interaction.reply({
        embeds: [
            new EmbedBuilder()
            
            .setDescription(`\`${emoji}\` | ${description}`)
            .setColor(COLOR)
        ],
        ephemeral: type
    })
    
}

module.exports = Reply