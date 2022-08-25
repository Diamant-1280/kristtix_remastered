import { ExtendedClient } from "@classes/Client"
import { ChatInputApplicationCommandData, ChatInputCommandInteraction, GuildMember } from "discord.js"

export interface ExtendedInteraction extends ChatInputCommandInteraction {
    member: GuildMember,
}

interface RunOptions {
    client: ExtendedClient,
    interaction: ChatInputCommandInteraction,
}

type RunFunction = (options: RunOptions) => any

export type CommandType = {
    cooldown?: number
    run: RunFunction
} & ChatInputApplicationCommandData