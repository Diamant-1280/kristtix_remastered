import { Event } from "@classes/Event"
import { client } from "@app/index"
export default new Event('messageCreate', async (message) => {
	if (message.author.bot) return
	const prefix = "!e"
	if (message.content.startsWith(prefix) &&  client.owners.includes(message.author.id)) {
		const args = message.content.slice(prefix.length).trim().split(" ")
		const { db } = client
		try {
			let evaled = eval(args.join(" "));
			let eevaled = typeof evaled;
			const tyype = eevaled[0].toUpperCase() + eevaled.slice(1);
			if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
			console.log(evaled)
		} catch (err) {
			console.log(err)
		}
	}
	client.util.message_function(message)
})