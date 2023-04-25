import { CustomClient, PlayerEvent } from "../../structure/index.js"
import { Node } from "erela.js"

export default new PlayerEvent({
    name: "nodeConnect",
    execute(node: Node, client: CustomClient) {

        client.logger.info("Lavalink", `Node ${node.options.identifier} (${node.options.host}) connected`)

    },
})