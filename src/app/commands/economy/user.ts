import { Command } from "@classes/Command"
import { Guild_User_Basic, Guild_User_Interface } from "@interfaces/MongoDB"
import { ApplicationCommandOptionType } from "discord.js"
export default new Command({
    name: "balance",
    nameLocalizations: { "ru": "баланс" },
    description: "Показывает ваш баланс",
    run: async ({ interaction, client }) => {
        if (!interaction.inCachedGuild()) return
        const member = interaction.options.getMember('user') || interaction.member
        const data = await client.db.getOrInsert<Guild_User_Interface>('guild-users', { guildID: interaction.guildId, userID: member.id }, Guild_User_Basic(member.id, interaction.guildId))

    },
    
    dmPermission: false,
    options: [{
        name: "user",
        nameLocalizations: { "ru": "пользователь" },
        description: "Укажите пользователя",
        type: ApplicationCommandOptionType.User
    }]
})