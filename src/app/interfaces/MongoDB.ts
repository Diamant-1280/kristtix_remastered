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
    rooms_categoryID: string | null,
    blocked_commands: string[],
    Economy: Guild_Economy
}

export function Guild_Basic(id: string, owner_id: string, ): Guild_Interface {
    return {
        guildID: id,
        ownerID: owner_id,
        rooms_categoryID: null,
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
            bannerURL: "https://steamuserimages-a.akamaihd.net/ugc/910171378794670871/E2272D6BA9565D84B624496D1D54B6CCF2B8D4DF/",
            hexColor: "#3d8e6b"
        }
    }
    
    
}