import { Command } from "@classes/Command";
import { Guild_Interface, Guild_User_Interface } from "@interfaces/MongoDB";
import { ApplicationCommandOptionType } from "discord.js";
export default new Command({
    name: "crime",
    nameLocalizations: { ru: "кража" },
    description: "Попытейтесь украсть у пользователя деньги!",
    run: async ({ interaction, client }) => {
        if (!interaction.inCachedGuild()) return
        const member = interaction.options.getMember("user"),
            cash = interaction.options.getInteger('count')

        const thief: Guild_User_Interface = await client.db.getOne<Guild_User_Interface>('guild-users', { guildID: interaction.guildId, userID: interaction.user.id })
        const victim: Guild_User_Interface = await client.db.getOne<Guild_User_Interface>('guild-users', { guildID: interaction.guildId, userID: member.user.id })

        const remainingTime: Date = new Date(thief.cooldowns.crime - Date.now())
        if (thief.cooldowns.crime > Date.now())
            return interaction.reply(`Повторное использование команды через **${remainingTime.getHours() - 4}ч ${remainingTime.getMinutes()}мин ${remainingTime.getSeconds()}сек**`)

        const res: Guild_Interface = await client.db.getOne<Guild_Interface>('guilds', { guildID: interaction.guildId })

        if (cash > 800) return
        if (victim.economy.cash < cash) return interaction.reply(`Вы не можете украсть у пользователя больше, чем у него есть!`)
        if (victim.userID == thief.userID) return interaction.reply('Вы не можете украсть у самого себя!')

        const cashRegExp = /\${cash}|{cash}|<cash>|\${money}|{money}|<money>/ig,
            userRegExp = /\${user}|{user}|<user>/ig

        if (Math.round(Math.random() * 100) > 75) {
            thief.economy.cash += cash
            thief.cooldowns.crime = Date.now() + 1000 * 60 * 60 * 15
            victim.economy.cash -= cash
            client.db.save<Guild_User_Interface>('guild-users', victim)

            const message = res.messages.crime.success[Math.floor(Math.random() * res.messages.crime.success.length)] || "Вы украли <money> у <user>"
            interaction.reply(message.replaceAll(cashRegExp, `**<a:money:840284930563113071> ${cash}**`).replaceAll(userRegExp, `<@!${member.id}>`))
            
        } else {
            thief.economy.cash -= (cash / 2)
            thief.cooldowns.crime = Date.now() + 1000 * 60 * 60 * 10

            const message = res.messages.crime.fail[Math.floor(Math.random() * res.messages.crime.fail.length)] || "Вам не удалось украсть деньги у <user>, Вы потеряли <money>"
            interaction.reply(message.replaceAll(cashRegExp, `**<a:money:840284930563113071> ${cash / 2}**`).replaceAll(userRegExp, `<@!${member.id}>`))
        }

        client.db.save<Guild_User_Interface>("guild-users", thief)
    },
    options: [{
        name: "user",
        nameLocalizations: { ru: "участник" },
        description: "Укажите участника, у которого хотите украсть деньги",
        type: ApplicationCommandOptionType.User,
        required: true
    }, {
        name: "count",
        nameLocalizations: { ru: "сумма" },
        description: "Укажите количество денег, которое вы хотите украсть",
        type: ApplicationCommandOptionType.Integer,
        minValue: 30,
        maxValue: 800,
        required: true
    }],
    dmPermission: false
})