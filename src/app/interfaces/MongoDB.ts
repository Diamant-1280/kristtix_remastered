import { HexColorString, Snowflake } from "discord.js"
import { URL } from "url"

interface Guild_Economy {
    shop: Record<Snowflake, number>,
    exp_bonus: number,
    bank: number
}

export interface Guild_Interface {
    _id?: any,
    guildID: string
    blocked_commands: string[]
}

export function Guild_Basic(id: string): Guild_Interface {
    return {
        guildID: id,
        blocked_commands: []
    }
}

export interface Guild_User_Interface {
    _id?: any,
    userID: string,
    guildID: string,
    rating: {
        level: number,
        exp: number
    }
}

export function Guild_User_Basic(user_id: string, guild_id: string): Guild_User_Interface {
    return {
        userID: user_id,
        guildID: guild_id,
        rating: {
            level: 0,
            exp: 0
        }
    }
}

export interface User_Interface {
    _id?: any,
    userID: string,
    rankCard: {
        color: HexColorString,
        url: `https://${string}/${string}`
    } 
}

export function User_Basic(user_id: string): User_Interface {
    return {
        userID: user_id,
        rankCard: {
            color: "#",
            url: "https://images5.alphacoders.com/862/thumb-1920-862186.png"
        }
    }
}