import { ExtendedClient } from "@classes/Client"
import { ChatInputApplicationCommandData, ChatInputCommandInteraction, CommandInteraction, CommandInteractionOptionResolver, GuildMember, PermissionResolvable } from "discord.js"

export interface ExtendedInteraction extends ChatInputCommandInteraction {
    member: GuildMember,
    
}

interface RunOptions {
    client: ExtendedClient,
    interaction: ChatInputCommandInteraction,
    args: CommandInteractionOptionResolver
}

type RunFunction = (options: RunOptions) => any

export type CommandType = {
    userPermissions?: PermissionResolvable[]
    cooldown?: number
    run: RunFunction
} & ChatInputApplicationCommandData