import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection, Guild, Message, AttachmentBuilder } from 'discord.js'
import { RegisterCommandsOptions } from '@interfaces/Client'
import { CommandType } from '@interfaces/Commands'
import { Config } from '@interfaces/Config'
import { promisify } from "util"
import { Event } from '@classes/Event'
import MongoDB from '@classes/MongoDB'
import glob from 'glob'
const globPromise = promisify(glob)
export class ExtendedClient extends Client {
    public talkedRecently: Set<String> = new Set()
    public commands: Collection<string, CommandType> = new Collection()
    public owners: string[] = ["516654639480045588"]
    public db: MongoDB = new MongoDB(process.env.MONGODB_URL)
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
        const commandFiles: string[] = await globPromise(`${__dirname}/../commands/*/*{.ts,.js}`)
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
            async function Eval(message: Message): Promise<void> {
                const args: string[] = message.content.slice(prefix.length + 1).trim().split(" ")
                const code: string = args.join(" ")
                async function clean(code: string): Promise<string> {
                    if (code && code.constructor.name == "Promise")
                        code = await code;
                    if (typeof code !== "string")
                        code = require("util").inspect(code, { depth: 0 })
                    code = code.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
                    return code;
                }

                try {
                    const evaled: any = args.includes("await") ? eval(`(async () => { ${code} })()`) : eval(code), cleaned = await clean(evaled);
                    const text: string = cleaned.length > 2000 ? "Текст содержит более 2к символов блэт. Выслан ебучий файл." : cleaned;
                    const file: any = cleaned.length > 2000 ? [new AttachmentBuilder(Buffer.from(`${cleaned}`), { name: "HelloMyFirstOtchim.js" })] : [];
                    await message.reply({ content: `\`\`\`js\n${text}\n\`\`\``, files: file })
                } catch (err) {
                    message.channel.send({ content: `\`ERROR\`\n\`\`\`x1\n${err}\n\`\`\`` })
                }
            }

            const prefix = '~'
            if (message.content.startsWith(prefix + 'e') && this.owners.includes(message.author.id)) Eval.call(this, (message))
            if (message.content.startsWith(prefix + 'setup') && this.owners.includes(message.author.id)) {
                this.registerCommands({
                    commands: slashCommands,
                    guildId: message.guild.id

                })
            }
        })


        const eventFiles: string[] = await globPromise(`${__dirname}/../events/*{.ts,.js}`)
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