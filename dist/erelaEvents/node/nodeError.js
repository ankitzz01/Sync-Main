"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../structure/index.js");
exports.default = new index_js_1.PlayerEvent({
    name: "nodeError",
    execute(node, error, client) {
        client.logger.error("Lavalink", `Node ${node.options.identifier} (${node.options.host}) connection error ${error.toString()}`);
    },
});
