import { Event } from "@classes/Event"
import { client } from "@app/index"
import { Guild_Basic, Guild_Interface, Guild_User_Basic, Guild_User_Interface } from "@interfaces/MongoDB";
import { ChannelType, Message } from "discord.js";
import Eval from "@util/eval";
export default new Event('messageCreate', async (message) => {
    if (!message || message.author.bot) return

    if (message.content.startsWith('```js') && message.content.endsWith('```') && client.owners.includes(message.author.id)) return Eval.call(client, message)

    if (message.channel.type === ChannelType.DM) return
    const [res, data]: [Guild_Interface, Guild_User_Interface] = await database_check(message.guildId, message.author.id)
    if (data && res) await rating_update(message, [data, res])

    async function database_check(guildID: string, userID: string): Promise<[Guild_Interface, Guild_User_Interface]> {
        const { db } = client
        const res: Guild_Interface = await db.getOrInsert<Guild_Interface>('guilds', { guildID: guildID }, Guild_Basic(guildID))
        const data: Guild_User_Interface = await db.getOrInsert<Guild_User_Interface>('guild-users', { guildID: guildID, userID: userID }, Guild_User_Basic(userID, guildID))
        return [res, data]
    }

    async function rating_update(message: Message, [data]: [Guild_User_Interface, Guild_Interface]): Promise<void> {
        if (client.talkedRecently.has(message.author.id)) return
        const { db } = client
        const givenExp: number = Math.floor(Math.random() * 11) + 15
        const neededExp: number = 5 * data.rating.level ** 2 + 50 * data.rating.level + 100
        data.rating.exp += givenExp
        if (data.rating.exp >= neededExp) {
            data.rating.exp = 0
            data.rating.level += 1
        }
        await db.save('guild-users', data)
        client.talkedRecently.add(message.author.id)
        setTimeout(() => client.talkedRecently.delete(message.author.id), 60 * 1000)
    }
})