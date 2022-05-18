import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection, Message } from 'discord.js'
import { RegisterCommandsOptions } from '@interfaces/Client'
import { CommandType } from '@interfaces/Commands'
import { Config } from '@interfaces/Config'
import { promisify } from "util"
import { Event } from '@classes/Event'
import MongoDB from '@classes/MongoDB'
import glob from 'glob'
import Util from '@util/Message'
const globPromise = promisify(glob)
export class ExtendedClient extends Client {
    public commands: Collection<string, CommandType> = new Collection()
    public owners: string[] = ["516654639480045588", "773496547614392350"]
    public db: MongoDB = new MongoDB(process.env.dataURL)
    public util: Util = new Util(this)
    constructor() {
        super({
            intents: 32767
        })
    }

    async importFile(filePath: string) {
        return (await import(filePath))?.default
    }
    
    async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
        if (guildId) {
            this.guilds.cache.get(guildId)?.commands.set(commands)
            console.log(`Registering commands to ${guildId}`)
        } else {
            this.application?.commands.set(commands)
            console.log(`Registering global commands`)
        }
    }

    async registerModules() {
        const slashCommands: ApplicationCommandDataResolvable[] = []
        const commandFiles = await globPromise(`${__dirname}/../commands/*/*{.ts,.js}`)
        commandFiles.forEach(async filePath => {
            const command: CommandType = await this.importFile(filePath)
            if (!command.name) return

            this.commands.set(command.name, command)
            slashCommands.push(command)
        })

        this.on("guildCreate", (guild) => {
            this.registerCommands({
                commands: slashCommands,
                guildId: guild.id
            })
        })
        
        this.on("messageCreate", (message) => {
            async function Eval (message: Message) {
                const args = message.content.slice(prefix.length + 1).trim().split(" ")
                try {
                    let evaled = eval(args.join(" "));
                    let eevaled = typeof evaled;
                    const tyype = eevaled[0].toUpperCase() + eevaled.slice(1);
                    if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
                    message.reply("```\n" + evaled + '```')
                } catch (err) {
                    message.channel.send("```\n" + err + '```')
                }
            }
            const prefix = '!'
            if (message.content.startsWith(prefix + 'e') && this.owners.includes(message.author.id)) Eval.call(this, (message))
            if (message.content.startsWith(prefix + 'setup') && this.owners.includes(message.author.id)) {
                this.registerCommands({
                    commands: slashCommands
                })
            }
        })
           

        const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`)
        eventFiles.forEach(async filePath => {
            const event: Event<keyof ClientEvents> = await this.importFile(filePath)
            this.on(event.event, event.run)
        })
    }

    async start(config: Config): Promise<void> {
        await this.db.connect()
        await this.registerModules()
        await this.login(config.token)
    }

}