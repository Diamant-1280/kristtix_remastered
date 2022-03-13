import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection /* as BaseClient, Collection */ } from 'discord.js'
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
    public owners: string[] = ["516654639480045588"]
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
            if (message.content == "/setup" && this.owners.includes(message.author.id)) {
                this.registerCommands({
                    commands: slashCommands,
                    guildId: message.guildId
                })
                message.channel.send("Установка команд прошла успешно!")
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