import { Guild, GuildMember, User } from "discord.js";
import { client } from "@app/index";
import { Guild_User_Basic, Guild_User_Interface, User_Basic, User_Interface } from "@interfaces/MongoDB";

export async function RatingPos(guild: Guild, member: GuildMember) {
    const user = await client.db.getOne<Guild_User_Interface>('guild-users', { guildID: guild.id, userID: member.id })
    const users = await client.db.getMany<Guild_User_Interface>('guild-users', { guildID: guild.id })
    const sortedUsers = users.sort((A, B) => (A.rating.level > B.rating.level) ? 1 : (A.rating.level != B.rating.level) ? 1 : (A.rating.exp > B.rating.exp) ? 1 : -1)
    return sortedUsers.findIndex(x => x.userID == user.userID)
}

export async function SetGuildMember(member: GuildMember) {
    return client.db.getOrInsert<Guild_User_Interface>('guild-users', { guildID: member.guild.id, userID: member.id }, Guild_User_Basic(member.id, member.guild.id))
}

export async function SetMember(user: User | GuildMember) {
    return client.db.getOrInsert<User_Interface>('users', { userID: user.id }, User_Basic(user.id))
}