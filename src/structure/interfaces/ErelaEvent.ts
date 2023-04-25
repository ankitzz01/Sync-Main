export class PlayerEvent {
    public data: PlayerEventOptions;
    constructor(options: PlayerEventOptions) {
        this.data = options;
    }
}

type ValidEvents =
    "socketClosed" |
    "nodeConnect" |
    "nodeDisconnect" |
    "nodeError" |
    "queueEnd" |
    "trackEnd" |
    "trackStart" |
    "trackStuck" |
    "playerDisconnect" |
    "playerMove" |
    "playerDestroy" |
    "nodeError" |
    "nodeRaw" |
    "nodeReconnect"

export interface PlayerEventOptions {
    name: any | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute: (...args: any[]) => any;
}