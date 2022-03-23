import { HexColorString, Snowflake } from "discord.js"

interface Guild_Economy {
    shop: Record<Snowflake, number>,
    exp_bonus: number,
    bank: number
}

export interface Guild_Interface {
    _id?: any,
    guildID: string,
    ownerID: string,
    blocked_commands: string[],
    Economy: Guild_Economy
}

export function Guild_Basic(id: string, owner_id: string, ): Guild_Interface {
    return {
        guildID: id,
        ownerID: owner_id,
        blocked_commands: [],
        Economy: {
            bank: 10000,
            exp_bonus: 1.0,
            shop: Object()
        }
    }
}
export interface User_Economy {
    balance: number,
    exp: number,
    level: number,
    rep: number
}

export interface User_Interface {
    _id?: any,
    userID: string,
    guildID: string,
    Economy: User_Economy
    RankCard: {
        bannerURL: string,
        hexColor: HexColorString
    }
}

export function User_Basic (user_id: string, guild_id: string): User_Interface {
    return {
        userID: user_id,
        guildID: guild_id,
        Economy: {
            balance: 0,
            exp: 0,
            level: 0,
            rep: 0
        },
        RankCard: {
            bannerURL: "https://cdn.discordapp.com/attachments/871442909180878910/918566010548793374/837258.png",
            hexColor: "#faa923"
        }
    }
}