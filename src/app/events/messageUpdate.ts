import { Event } from "@classes/Event"
import Eval from "@util/eval"
import { client } from "@app/index"
export default new Event('messageUpdate', (oldMessage, newMessage) => {
    if (!newMessage || newMessage.author.bot) return
    if (newMessage.content.startsWith('```js') && newMessage.content.endsWith('```')) return Eval.call(client, newMessage)
})