import { ExtendedClient } from "@classes/Client"
import { ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, GuildMember, MessageContextMenuInteraction, PermissionResolvable, UserContextMenuInteraction } from "discord.js"

export interface ExtendedInteraction extends CommandInteraction {
    member: GuildMember
}

interface RunOptions {
    client: ExtendedClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
}

type RunFunction = (options: RunOptions) => any

export type CommandType = {
    userPermissions?: PermissionResolvable[]
    cooldown?: number
    run: RunFunction
} & ChatInputApplicationCommandData