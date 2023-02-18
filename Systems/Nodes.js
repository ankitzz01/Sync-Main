const nodes = [
    {
        name: "Main Lavalink",
        id: "main",
        host: "142.93.9.106",
        port: 8000,
        password: "blablabla",
        retryAmount: 4,
        retryDelay: 6000,
        secure: false
    },
    {

        name: "Lavalink Spider",
        id: "primary",
        host: "11108.frankfurt1.spiderservers.cloud",
        port: 11108,
        password: "ankit123",
        retryAmount: 5,
        retryDelay: 6000,
        secure: false

    },
    {
        name: "DragoLuca Lavalink",
        id: "secondary",
        host: "54.144.186.93",
        port: 80,
        password: "Sa22112001",
        retryAmount: 15,
        retryDelay: 6000,
        secure: false
    },
]

module.exports = nodes