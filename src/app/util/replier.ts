import { APIEmbed, Colors, EmbedData, GuildMember } from "discord.js";

export function successEmbed(member: GuildMember, succesMessage: string): APIEmbed {
    return {
        color: Colors.Green,
        // author: {
        //     name: member.displayName,
        //     icon_url: member.displayAvatarURL()
        // },
        description: succesMessage
    }
}

export function errorEmbed(member: GuildMember, errorMessage: string): APIEmbed {
    return {
        color: Colors.Red,
        title: "Ошибка",
        // author: {
        //     name: member.displayName,
        //     icon_url: member.displayAvatarURL()
        // },
        description: errorMessage
    }
}