"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("@classes/Event");
const index_1 = require("@app/index");
exports.default = new Event_1.Event('messageCreate', async (message) => {
    if (message.author.bot)
        return;
    const prefix = "!e";
    if (message.content.startsWith(prefix) && index_1.client.owners.includes(message.author.id)) {
        const args = message.content.slice(prefix.length).trim().split(" ");
        const { db } = index_1.client;
        try {
            let evaled = eval(args.join(" "));
            let eevaled = typeof evaled;
            const tyype = eevaled[0].toUpperCase() + eevaled.slice(1);
            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);
            console.log(evaled);
        }
        catch (err) {
            console.log(err);
        }
    }
    index_1.client.util.message_function(message);
});
//# sourceMappingURL=Message.js.map