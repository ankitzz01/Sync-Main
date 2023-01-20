const nodes = [
    {
        name: "DragoLuca Lavalink",
        id: "main",
        host: "54.144.186.93",
        port: 80,
        password: "Sa22112001",
        retryAmount: 15,
        retryDelay: 6000,
        secure: false
    },
    /*{

        name: "Lavalink",
        id: "mainn",
        host: "38.105.232.73",
        port: 25038,
        password: "ankitzz123",
        retryAmount: 15,
        retryDelay: 6000,
        secure: false

    },*/
    {
        name: "Repl",
        id: "secondary",
        host: "lavalink-replit-ankitzz.ankitdey4.repl.co",
        port: 8080,
        password: "ankit123",
        retryAmount: 15,
        retryDelay: 6000,
        secure: true
    },
]

module.exports = nodes