import { APIEmbed, Colors, EmbedData, GuildMember } from "discord.js";

export function successEmbed(member: GuildMember, successMessage: string): APIEmbed {
    return {
        color: Colors.Green,
        author: {
            name: member.displayName,
            icon_url: member.displayAvatarURL()
        },
        description: successMessage
    }
}

export function errorEmbed(errorMessage: string): APIEmbed[] {
    return [{
        color: Colors.Red,
        title: "Ошибка",
        description: errorMessage
    }]
}