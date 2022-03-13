import { CommandType } from "@interfaces/Commands";

export class Command {
    constructor(commandOptions: CommandType) {
        Object.assign(this, commandOptions)
    }
}