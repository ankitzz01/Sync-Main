const { ActionRowBuilder, ButtonBuilder, ComponentType, ButtonStyle, EmbedBuilder } = require("discord.js")

async function Pagination(interaction, embedpages, user) {

    const HardLeft = "<:whitehardleft:1026545634767020093>"
    const HardRight = "<:whitehardright:1026545637535264800>"
    const OneLeft = "<:whiteleft:1026545640097988608>"
    const OneRight = "<:whiteright:1026545642815897740>"
    const CrossMid = "<:whitecross:1026545632686653550>"

    let Current = 0

    await interaction.deferReply()

    let row = new ActionRowBuilder().addComponents(
        [
            new ButtonBuilder({
                type: ComponentType.Button,
                customId: "4",
                emoji: `${HardLeft}`,
                style: ButtonStyle.Primary,
                disabled: true
            }),
            
            new ButtonBuilder({
                type: ComponentType.Button,
                customId: "1",
                emoji: `${OneLeft}`,
                style: ButtonStyle.Primary,
                disabled: true
            }),

            new ButtonBuilder({
                type: ComponentType.Button,
                customId: "3",
                emoji: `${CrossMid}`,
                style: ButtonStyle.Danger
            }),

            new ButtonBuilder({
                type: ComponentType.Button,
                customId: "2",
                emoji: `${OneRight}`,
                style: ButtonStyle.Primary,
                disabled: embedpages.length < 2
            }),

            new ButtonBuilder({
                type: ComponentType.Button,
                customId: "5",
                emoji: `${HardRight}`,
                style: ButtonStyle.Primary,
                disabled: embedpages.length < 2
            })
        ]
    )

    const Embed = await interaction.editReply({ embeds: [embedpages[Current]], components: [row] })

    const col = await Embed.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 1000 * 60 * 4
    })

    col.on("collect", i => {

        if (i.user.id !== user.id) return i.reply({
            embeds: [new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription(`You cannot use this button`)
            ], ephemeral: true
        })

        if (i.customId === "1") Current--
        else if (i.customId === "2") Current++
        else if (i.customId === "4") Current = 0
        else if (i.customId === "5") Current = embedpages.length - 1
        else return col.stop()

        row.components = [
            new ButtonBuilder({
                type: ComponentType.Button,
                customId: "4",
                emoji: `${HardLeft}`,
                style: ButtonStyle.Primary,
                disabled: Current === 0
            }),
            new ButtonBuilder({
                type: ComponentType.Button,
                customId: "1",
                emoji: `${OneLeft}`,
                style: ButtonStyle.Primary,
                disabled: Current === 0
            }),
            new ButtonBuilder({
                type: ComponentType.Button,
                customId: "3",
                emoji: `${CrossMid}`,
                style: ButtonStyle.Danger
            }),
            new ButtonBuilder({
                type: ComponentType.Button,
                customId: "2",
                emoji: `${OneRight}`,
                style: ButtonStyle.Primary,
                disabled: Current === embedpages.length - 1
            }),
            new ButtonBuilder({
                type: ComponentType.Button,
                customId: "5",
                emoji: `${HardRight}`,
                style: ButtonStyle.Primary,
                disabled: Current === embedpages.length - 1
            })
        ]

        i.deferUpdate()

        Embed.edit({
            components: [row],
            embeds: [embedpages[Current]]
        })

    })

    col.on("end", () => {
        Embed.edit({
            components: []
        })
    })

}

module.exports = Pagination