import { Command } from "@classes/Command";
import { Guild_User_Interface } from "@interfaces/MongoDB";
import { errorEmbed } from "@util/replier";
import { ApplicationCommandOptionType } from "discord.js";
export default new Command({
    name: "pay",
    description: "Перевод средств с вашего баланса другому участнику",
    nameLocalizations: { ru: "перевод" },
    options: [{
        name: "user",
        nameLocalizations: { ru: "участник" },
        description: "Целевой участник",
        type: ApplicationCommandOptionType.User,
        required: true
    }, {
        name: "value",
        nameLocalizations: { ru: "сумма" },
        description: "Сумма для перевода",
        type: ApplicationCommandOptionType.Integer,
        minValue: 50,
        maxValue: 5000,
        required: true
    }],

    run: async ({ interaction, client }) => {
        if (!interaction.inCachedGuild()) return
        const member = interaction.member
        const user = interaction.options.getUser("user")
        const value = interaction.options.getInteger('value')
        const sender = await client.db.getOne<Guild_User_Interface>("guild-users", { guildID: interaction.guildId, userID: member.id })
        
        if (!interaction.options.getMember("user")) return interaction.reply({ embeds: errorEmbed("Пользователь не найден!") })
        if (user.id == member.id) return interaction.reply({ embeds: errorEmbed("Вы не можете перевести деньги самому себе!") })
        if (sender.economy.cash - value < 0) return interaction.reply({ embeds: errorEmbed("У вас недостаточно средств!") })
        if (user.bot) return interaction.reply({ embeds: errorEmbed("Вы не можете перевести деньги боту!") })

        interaction.reply({
            embeds: [{
                // author: { name: member.displayName, icon_url: member.displayAvatarURL() },
                title: "Перевод",
                fields: [
                    { name: "Отправитель", value: `<@!${member.id}>`, inline: true },
                    { name: "Получитель", value: `<@!${user.id}>`, inline: true },
                    { name: "Сумма", value: `**<a:money:840284930563113071> ${value}**`, inline: true },
                ],
                color: 0xffa55a,
                timestamp: interaction.createdAt.toISOString()
            }]
        })
        client.db.updateOne<Guild_User_Interface>('guild-users', { guildID: interaction.guildId, userID: user.id }, { $inc: { "economy.bank": value } })
        client.db.updateOne<Guild_User_Interface>('guild-users', { guildID: interaction.guildId, userID: member.id}, { $inc: { "economy.cash": -value } })
    },
    dmPermission: false,
})