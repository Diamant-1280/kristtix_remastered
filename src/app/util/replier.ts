import { APIEmbed, APIInteractionGuildMember, Colors, GuildMember } from "discord.js";

export function succesEmbed(member: APIInteractionGuildMember, succesMessage: string): APIEmbed {
    return {
        color: Colors.Green,
        author: {
            name: member.nick || member.user.username,
            icon_url: member.avatar
        },
        description: succesMessage
    }
}

export function errorEmbed(member: APIInteractionGuildMember, errorMessage: string): APIEmbed {
    return {
        color: Colors.Red,
        title: "Ошибка",
        author: {
            name: member.nick || member.user.username,
            icon_url: member.avatar
        },
        description: errorMessage
    }
}