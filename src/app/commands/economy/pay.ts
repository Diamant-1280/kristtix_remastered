import { Command } from "@classes/Command";
import { Guild_User_Interface } from "@interfaces/MongoDB";
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
    }, {
        name: "account",
        nameLocalizations: { ru: "счет" },
        description: "Выберите, перевести наличными или из банка?",
        type: ApplicationCommandOptionType.String,
        choices: [{
            name: "cash",
            nameLocalizations: { ru: "наличные" },
            value: "cash"
        }, {
            name: "bank",
            nameLocalizations: { ru: "банк" },
            value: "bank"
        }],
        required: true
    }],

    run: async ({ interaction, client }) => {
        if (!interaction.inCachedGuild()) return
        const user = interaction.options.getUser("user")
        const value = interaction.options.getInteger('value')
        const account = interaction.options.getString('account')
        const sender = await client.db.getOne<Guild_User_Interface>("guild-users", { guildID: interaction.guildId, userID: interaction.user.id })

        if (!interaction.options.getMember("user")) return interaction.reply("Ошибка, пользователь не найден!")
        if (user.id == interaction.member.user.id) return interaction.reply

        switch (account) {
            case "cash":
                if (value > sender.economy.cash) return interaction.reply({ embeds: [ errorEmbed(interaction.member, "У вас недостаточно средств!") ] })
                break
            case "bank": 
                if (value > sender.economy.bank) return interaction.reply({ embeds: [ errorEmbed(interaction.member, "У вас недостаточно средств!") ] })
                break
        }
        interaction.reply("passed")
    },
    dmPermission: false,
})