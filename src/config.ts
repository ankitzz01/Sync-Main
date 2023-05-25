import { ColorResolvable } from 'discord.js'

export default {
    
    dev: {
        id: "1074644311532122122",
        secret: "",
        token: "MTA3NDY0NDMxMTUzMjEyMjEyMg.GgQyt6.KaLKsOW-fAfgTRooa5Xe9RAUDQlYOSUG2T8-dU",
        db: "mongodb+srv://Ankit:ankit123@syncmusic.xtdd7nb.mongodb.net/test",
        log: {
            error: "1085926090435985468",
            guild: "1085926090435985468",
            command: "1085926090435985468"
        },
        webhook: {
            command: "",
            guild: "",
            error: ""
        },
    },
    prod: {
        id: "1050725403276353557",
        secret: "",
        token: "MTA1MDcyNTQwMzI3NjM1MzU1Nw.GY7AZ0.l6hBhk2U3PXiRLGhNM022Ad4GSZ4Zb2q-c1o4E",
        db: "mongodb+srv://Ankit:ankit123@syncmusic.xtdd7nb.mongodb.net/test",
        log: {
            error: "1066581621907652738",
            guild: "1066581467393704017",
            command: "1058609989389910076"
        },
        webhook: {
            command: "https://discord.com/api/webhooks/1111351087279128696/RRg0pQ7JihvvFyK3in6RkIjHlhUSwVUzl5sEVuzdB9ht_H3HCClReI8xXmie81KON3gM",
            guild: "https://discord.com/api/webhooks/1111352975055667400/KSryvfk0gjPGAHq26kduTh9OnnLj-rLPFRr2rQ8-pMnjKxtKEkNU8SBKJFUIuPlZUvnA",
            error: "https://discord.com/api/webhooks/1081855157039534152/Y7h4QGrlrVLIqgM_Dm35wVU49NplOlKNVGbBZAmM8cD62UouYKlhTM2K4b_Yqg7zk_xx"
        },
    },
    links: {
        invite: "https://discord.com/api/oauth2/authorize?client_id=1050725403276353557&permissions=274914896912&scope=bot%20applications.commands",
        support: "https://discord.gg/eYhxDZsUfB",
        background: "https://i.imgur.com/t7cnKVq.jpg"
    },
    topgg: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwNTA3MjU0MDMyNzYzNTM1NTciLCJib3QiOnRydWUsImlhdCI6MTY4MjQzODczNH0.h-ZOM4QOi_-uaueVN9hHay9BAzqnu3CkWTrM36qnFdM",
        vote: "https://top.gg/bot/1050725403276353557/vote"
    },
    spotify: {
        id: "fbfe2852893e4abca304ad59902430f2",
        secret: "96ca43c676a047e188e7ff1a856859a0",
    },
    handlers: {commands: "./dist/commands", events: "./dist/events", erelaEvents: "./dist/erelaEvents"},
    guilds: {
        dev: ["1075279991077621760"]
    },
    color: "Blue" as ColorResolvable,
    developers: ["911300377301880862"]
}