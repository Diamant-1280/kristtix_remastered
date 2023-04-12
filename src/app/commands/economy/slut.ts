import { Command } from "@classes/Command";
import { Guild_Interface, Guild_User_Interface } from "@interfaces/MongoDB";

export default new Command({
    name: "slut",
    nameLocalizations: { "ru": "проституция" },
    description: "Займитесь проституцией и получите легких денег! (работает раз в 8 часов)",
    run: async ({ interaction, client }) => {
        if (!interaction.inCachedGuild()) return
        const data: Guild_User_Interface = await client.db.getOne<Guild_User_Interface>('guild-users', { guildID: interaction.guildId, userID: interaction.user.id })
        
        const remainingTime = new Date(data.cooldowns.slut - Date.now())
        if (data.cooldowns.slut > Date.now())
        return interaction.reply(`Повторное использование команды через **${remainingTime.getHours()-4}ч ${remainingTime.getMinutes()}мин ${remainingTime.getSeconds()}сек**`)

        const res: Guild_Interface = await client.db.getOne<Guild_Interface>('guilds', { guildID: interaction.guildId })
        const cash = Math.floor(Math.random() * 400 ) + 300
        const message = res.messages.slut.success[Math.floor(Math.random() * res.messages.slut.success.length )] || "Вы получили <cash>"
        const cashRegExp = /\${cash}|{cash}|<cash>|\${money}|{money}|<money>/ig
        
        interaction.reply(message.replaceAll(cashRegExp, `**<a:money:840284930563113071> ${cash}**`))

        data.cooldowns.slut = Date.now() + 1000 * 60 * 60 * 8
        data.economy.cash += cash

        client.db.save('guild-users', data)
    },
    dmPermission: false
})