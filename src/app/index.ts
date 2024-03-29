import 'module-alias/register'
import { Config } from '@interfaces/Config'
import { ExtendedClient } from "@classes/Client"
import { registerFont } from 'canvas'
import path from 'path'
export const client = new ExtendedClient()
client.start(process.env as Config)

// try {
//     registerFont(path.join(__dirname, "./../../Comfortaa-Bold.ttf"), { family: "Comfortaa", style: "Bold" })
// } catch (e) { }

process.on("unhandledRejection", (reason) => {
    console.log(reason)
})