import { HexColorString } from "discord.js"
import { defaultParameters } from "@app/../../config.json"
export interface Shop_Item {
     name: string,
     description: string,
     price: number,
     roleID: string
}

export interface Guild_Interface {
    _id?: any,
    guildID: string
    blocked_commands: string[],
    shop: Shop_Item[]
}

export function Guild_Basic(id: string): Guild_Interface {
    return {
        guildID: id,
        blocked_commands: [],
        shop: []
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
        url: string
    } 
}

export function User_Basic(user_id: string): User_Interface {
    return {
        userID: user_id,
        rankCard: {
            color: defaultParameters.rankCard.color as HexColorString,
            url: defaultParameters.rankCard.url
        }
    }
}