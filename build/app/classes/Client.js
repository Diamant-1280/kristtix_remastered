"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedClient = void 0;
const discord_js_1 = require("discord.js");
const util_1 = require("util");
const MongoDB_1 = __importDefault(require("@classes/MongoDB"));
const glob_1 = __importDefault(require("glob"));
const Message_1 = __importDefault(require("@util/Message"));
const globPromise = (0, util_1.promisify)(glob_1.default);
class ExtendedClient extends discord_js_1.Client {
    constructor() {
        super({
            intents: 32767
        });
        this.commands = new discord_js_1.Collection();
        this.owners = ["516654639480045588"];
        this.db = new MongoDB_1.default(process.env.dataURL);
        this.util = new Message_1.default(this);
    }
    async importFile(filePath) {
        return (await Promise.resolve().then(() => __importStar(require(filePath))))?.default;
    }
    async registerCommands({ commands, guildId }) {
        if (guildId) {
            this.guilds.cache.get(guildId)?.commands.set(commands);
            console.log(`Registering commands to ${guildId}`);
        }
        else {
            this.application?.commands.set(commands);
            console.log(`Registering global commands`);
        }
    }
    async registerModules() {
        const slashCommands = [];
        const commandFiles = await globPromise(`${__dirname}/../commands/*/*{.ts,.js}`);
        commandFiles.forEach(async (filePath) => {
            const command = await this.importFile(filePath);
            if (!command.name)
                return;
            this.commands.set(command.name, command);
            slashCommands.push(command);
        });
        this.on("guildCreate", (guild) => {
            this.registerCommands({
                commands: slashCommands,
                guildId: guild.id
            });
        });
        this.on("messageCreate", (message) => {
            if (message.content == "/setup" && this.owners.includes(message.author.id)) {
                this.registerCommands({
                    commands: slashCommands,
                    guildId: message.guildId
                });
                message.channel.send("Установка команд прошла успешно!");
            }
        });
        const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`);
        eventFiles.forEach(async (filePath) => {
            const event = await this.importFile(filePath);
            this.on(event.event, event.run);
        });
    }
    async start(config) {
        await this.db.connect();
        await this.registerModules();
        await this.login(config.token);
    }
}
exports.ExtendedClient = ExtendedClient;
//# sourceMappingURL=Client.js.map