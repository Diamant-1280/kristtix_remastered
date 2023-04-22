import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection, Guild, GuildMember } from 'discord.js'
import { RegisterCommandsOptions } from '@interfaces/Client'
import { CommandType } from '@interfaces/Commands'
import { Config } from '@interfaces/Config'
import { promisify } from "util"
import { Event } from '@classes/Event'
import MongoDB from '@classes/MongoDB'
import glob from 'glob'
const globPromise = promisify(glob)
export class ExtendedClient extends Client {
    constructor() {
        super({
            intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent', 'GuildPresences']
        })
    }

    
    public check = async (collection: string = 'guild-users') => {
        const obj = await this.db.getMany(collection)
        return JSON.stringify(obj, null, 2)
    }

    public reg = (guild: Guild) => {
        if (!guild?.id) return "Oops! Missing guild!"
        if (!guild) return "Oops! Guild not found!"
        this.registerCommands({
            commands: this.slashCommands,
            guildId: guild.id
        })
        return `Succesful registering commands to ${guild.name} | ${guild.id}`
    }

    public talkedRecently: Set<String> = new Set()
    public slashCommands: ApplicationCommandDataResolvable[] = []
    public commands: Collection<string, CommandType> = new Collection()
    public owners: string[] = ["516654639480045588"]
    public db: MongoDB = new MongoDB(process.env.MONGODB_URL)

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
        const commandFiles: string[] = await globPromise(`${__dirname}/../commands/*/*{.ts,.js}`)
        commandFiles.forEach(async filePath => {
            const command: CommandType = await this.importFile(filePath)
            if (!command.name) return

            this.commands.set(command.name, command)
            this.slashCommands.push(command)
        })

        this.on("guildCreate", (guild) => {
            this.registerCommands({
                commands: this.slashCommands,
                guildId: guild.id
            })
        })

        const eventFiles: string[] = await globPromise(`${__dirname}/../events/*{.ts,.js}`)
        eventFiles.forEach(async filePath => {
            const event: Event<keyof ClientEvents> = await this.importFile(filePath)
            this.on(event.event, event.run)
        })
    }

    async start(config: Config): Promise<void> {
        await this.db.connect().then(x => console.log("[DB] MongoDB has been connected"))
        await this.registerModules()
        await this.login(config.token)
        // this.registerCommands({ commands: this.slashCommands })
    }

}