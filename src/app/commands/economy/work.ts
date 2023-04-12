import { Command } from "@classes/Command";
import { Guild_Interface, Guild_User_Basic, Guild_User_Interface } from "@interfaces/MongoDB";

export default new Command({
    name: "work",
    nameLocalizations: { "ru": "работа" },
    description: "Получите немного денег раз в 5 часов",
    run: async ({ interaction, client }) => {
        if (!interaction.inCachedGuild()) return
        const data: Guild_User_Interface = await client.db.getOrInsert<Guild_User_Interface>('guild-users', { guildID: interaction.guildId, userID: interaction.user.id }, Guild_User_Basic(interaction.member.id, interaction.guild.id))

        const remainingTime = new Date(data.cooldowns.work - Date.now())
        if (data.cooldowns.work > Date.now())
        return interaction.reply(`Повторное использование команды через **${remainingTime.getHours()-4}ч ${remainingTime.getMinutes()}мин ${remainingTime.getSeconds()}сек**`)
            
        const res = await client.db.getOne<Guild_Interface>('guilds', { guildID: interaction.guildId })
        const cash = Math.floor(Math.random() * 200 ) + 100

        const message = res.messages.work[Math.floor(Math.random() * res.messages.work.length)] || "Вы заработали <money>"

        const cashRegExp = /\${cash}|{cash}|<cash>|\${money}|{money}|<money>/ig
        
        interaction.reply(message.replaceAll(cashRegExp, `**<a:money:840284930563113071> ${cash}**`))

        data.cooldowns.work = Date.now() + 1000 * 60 * 60 * 5
        data.economy.cash += cash

        client.db.save<Guild_User_Interface>('guild-users', data)
    },
    dmPermission: false
})