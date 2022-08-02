import { ExtendedClient } from "@classes/Client";
import { Guild_Basic, Guild_Interface, User_Basic, User_Interface } from "@interfaces/MongoDB";
import { Message, MessageEmbed } from "discord.js";
export default class {
    public constructor(private client: ExtendedClient) { }
    public async message_function(message: Message): Promise<Message | undefined> {
        if (!message || message.channel.type === 'DM' || !message.guild || !message.member || !message.guild.me || message.author.bot) return

        const [res, data] = await this.database_check(message.guildId, message.author.id, message.guild.ownerId)

        if (data && res) {
            await this.Economy_Update(message, [data, res])
        }
    }

    private async database_check(guildID: string, userID: string, ownerID: string | undefined): Promise<[Guild_Interface, User_Interface]> {
        const { db } = this.client
        const res = await db.getOrInsert<Guild_Interface>('guilds', { guildID: guildID }, Guild_Basic(guildID, ownerID))
        const data = await db.getOrInsert<User_Interface>('users', { guildID: guildID, userID: userID }, User_Basic(userID, guildID))

        return [res, data]
    }

    private async Economy_Update(message: Message, [data, res]: [User_Interface, Guild_Interface]): Promise<void> {
        const { db } = this.client
        const givenExp = Math.floor((Math.floor(Math.random() * 11) + 15) * res.Economy.exp_bonus)
        const neededExp = 5 * data.Economy.level ** 2 + 50 * data.Economy.level + 100
        data.Economy.exp += givenExp
        if (data.Economy.exp >= neededExp) {
            data.Economy.exp = 0
            data.Economy.level += 1
        }
        await db.save('users', data)
    }
}
