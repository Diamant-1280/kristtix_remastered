import { HexColorString } from "discord.js"
export interface ShopItem {
    name: string,
    description: string,
    price: number,
    roleID?: string
}

export interface Guild_Interface {
    _id?: any,
    guildID: string
    shop: ShopItem[],
    messages: {
        work: string[],
        slut: string[],
        crime: {
            success: string[],
            fail: string[]
        }
    }
}

export function Guild_Basic(id: string): Guild_Interface {
    return {
        guildID: id,
        shop: [],
        messages: {
            work: [
                "Вы работали день и ночь и получили ${cash}!",
                "Вы подработали и получили ${cash}!"
            ],
            slut: [
                "Вы трахались пол часа и получили от проститутки ${cash}",
                "Вы торговали жопой на обочине и получили ${cash}"
            ],
            crime: {
                success: [
                    "Вы украли ${cash} у ${user}",
                    "Вам удалось спиздить ${cash} у ${user}"
                ],
                fail: [
                    "Вас поймали за кражей ${user} и отняли ${cash}",
                    "Вам не удалось сьебаться незамеченным во время кражи ${user}, вы проебали ${cash}"
                ]
            }
        }
    }
}

export interface Guild_User_Interface {
    _id?: any,
    userID: string,
    guildID: string,
    rating: {
        level: number,
        exp: number
    },
    economy: {
        cash: number
        bank: number
    },
    cooldowns: {
        work: number,
        slut: number,
        crime: number
    }
}

export function Guild_User_Basic(user_id: string, guild_id: string): Guild_User_Interface {
    return {
        userID: user_id,
        guildID: guild_id,
        rating: {
            level: 0,
            exp: 0
        },
        economy: {
            cash: 0,
            bank: 0
        },
        cooldowns: {
            work: 0,
            slut: 0,
            crime: 0
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
            color: "#FEDBC7",
            url: "https://media.discordapp.net/attachments/971856939116023830/1081868211340984360/99px_ru_wallpaper_338352_doroga_uhodjashaja_v_dal_na_fone_krasnoj_luni.jpg?width=636&height=358"
        }
    }
}