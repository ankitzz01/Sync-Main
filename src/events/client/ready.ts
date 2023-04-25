import { ActivityType, Events } from "discord.js";
import { CustomClient, Event } from "../../structure/index.js";

export default new Event({
    name: Events.ClientReady,
    once: true,
    execute(client: CustomClient) {
        
        client.player.init(client.user?.id)

        if (!client.user) return client.logger.error("System", `Error Finding : ${client.logger.highlight("Client User", "error")}`);
        client.logger.info("System", `Successfully Logged in to : ${client.logger.highlight(client.user.tag, "success")}`);

        client.user?.setActivity({
            name: "Music",
            type: ActivityType.Listening
        })
    }
});