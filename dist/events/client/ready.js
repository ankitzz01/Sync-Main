"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_js_1 = require("../../structure/index.js");
exports.default = new index_js_1.Event({
    name: discord_js_1.Events.ClientReady,
    once: true,
    execute(client) {
        client.player.init(client.user?.id);
        if (!client.user)
            return client.logger.error("System", `Error Finding : ${client.logger.highlight("Client User", "error")}`);
        client.logger.info("System", `Successfully Logged in to : ${client.logger.highlight(client.user.username, "success")}`);
        client.user?.setActivity({
            name: "Music",
            type: discord_js_1.ActivityType.Listening
        });
    }
});
