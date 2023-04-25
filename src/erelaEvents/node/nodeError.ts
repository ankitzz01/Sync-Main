import { CustomClient, PlayerEvent } from "../../structure/index.js"
import { Node, Exception } from "erela.js"

export default new PlayerEvent({
    name: "nodeError",
    execute(node: Node, error: any, client: CustomClient) {

        client.logger.error(
            "Lavalink", `Node ${node.options.identifier} (${node.options.host}) connection error ${error.toString()}`
        )

    },
})