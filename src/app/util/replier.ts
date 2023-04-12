import { APIEmbed, APIInteractionGuildMember, Colors, GuildMember } from "discord.js";

export function succesEmbed(member: GuildMember, succesMessage: string): APIEmbed {
    return {
        color: Colors.Green,
        author: {
            name: member.displayName,
            icon_url: member.displayAvatarURL()
        },
        description: succesMessage
    }
}

export function errorEmbed(member: GuildMember, errorMessage: string): APIEmbed {
    return {
        color: Colors.Red,
        title: "Ошибка",
        author: {
            name: member.displayName,
            icon_url: member.displayAvatarURL()
        },
        description: errorMessage
    }
}