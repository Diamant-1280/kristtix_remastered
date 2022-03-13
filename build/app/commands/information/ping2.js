"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("@classes/Command");
exports.default = new Command_1.Command({
    name: "ping",
    description: "Отправляет вам в ебало pong x2",
    run: async ({ interaction }) => {
        interaction.followUp('Pong! Pong!');
    },
    cooldown: 10000
});
//# sourceMappingURL=ping2.js.map