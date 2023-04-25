"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashCommand = void 0;
class SlashCommand {
    data;
    category;
    botOwnerOnly;
    execute;
    constructor(options) {
        this.data = options.data;
        this.category = options.category;
        this.botOwnerOnly = options.botOwnerOnly || false;
        this.execute = options.execute;
    }
}
exports.SlashCommand = SlashCommand;
