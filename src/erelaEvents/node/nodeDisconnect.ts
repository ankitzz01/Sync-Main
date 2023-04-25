import { CustomClient, PlayerEvent } from "../../structure/index.js"
import { Node } from "erela.js"

export default new PlayerEvent({
    name: "nodeDisconnect",
    execute(node: Node, client: CustomClient) {

        client.logger.debug("Lavalink", `Node ${node.options.identifier} (${node.options.host}) disconnected`)

    },
})