import { Event } from "@classes/Event"
import { client } from "@app/index"
import { Guild_Basic, Guild_Interface, User_Basic, User_Interface } from "@interfaces/MongoDB";
import { ChannelType, Message } from "discord.js";
export default new Event('messageCreate', async (message) => {
    if (!message || message.channel.type === ChannelType.DM || message.author.bot) return

    const [res, data]: [Guild_Interface, User_Interface] = await database_check(message.guildId, message.author.id, message.guild.ownerId)
    if (data && res) await economy_update(message, [data, res])

    async function database_check(guildID: string, userID: string, ownerID: string | undefined): Promise<[Guild_Interface, User_Interface]> {
        const { db } = client
        const res: Guild_Interface = await db.getOrInsert<Guild_Interface>('guilds', { guildID: guildID }, Guild_Basic(guildID, ownerID))
        const data: User_Interface = await db.getOrInsert<User_Interface>('users', { guildID: guildID, userID: userID }, User_Basic(userID, guildID))
        return [res, data]
    }

    async function economy_update(message: Message, [data, res]: [User_Interface, Guild_Interface]): Promise<void> {
        if (!client.talkedRecently.has(message.author.id)) return
        const { db } = client
        const givenExp: number = Math.floor(Math.random() * 11) + 15
        const neededExp: number = 5 * data.Economy.level ** 2 + 50 * data.Economy.level + 100
        data.Economy.exp += givenExp
        if (data.Economy.exp >= neededExp) {
            data.Economy.exp = 0
            data.Economy.level += 1
        }
        await db.save('users', data)
        client.talkedRecently.add(message.author.id)
        setInterval(() => {
            client.talkedRecently.delete(message.author.id)
        }, 60 * 1000)
    }
})