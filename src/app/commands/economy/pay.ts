import { Command } from "@classes/Command";
import { Guild_User_Basic, Guild_User_Interface } from "@interfaces/MongoDB";
import { errorEmbed, successEmbed } from "@util/replier";
import { APIInteractionGuildMember, ApplicationCommandOptionType, GuildMember } from "discord.js";
export default new Command({
    name: "pay",
    description: "Перевод средств с вашего баланса другому участнику",
    nameLocalizations: { ru: "перевод" },
    options: [{
        name: "user",
        nameLocalizations: { ru: "участник" },
        description: "Укажите участника для перевода",
        type: ApplicationCommandOptionType.User,
        required: true
    }, {
        name: "value",
        nameLocalizations: { ru: "сумма" },
        description: "Укажите сумму для перевода",
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
        // запись получателя и зачисление
        await client.db.getOrInsert<Guild_User_Interface>('guild-users', { guildID: interaction.guildId, userID: user.id}, Guild_User_Basic(user.id, interaction.guildId))
        client.db.updateOne<Guild_User_Interface>('guild-users', { guildID: interaction.guildId, userID: user.id }, { $inc: { "economy.bank": value } })
        // вычисление у отправителя
        client.db.updateOne<Guild_User_Interface>('guild-users', { guildID: interaction.guildId, userID: member.id}, { $inc: { "economy.bank": -value } })
    },
    dmPermission: false,
})