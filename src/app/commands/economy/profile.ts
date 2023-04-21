import { Command } from "@classes/Command"
import { Guild_User_Basic, Guild_User_Interface } from "@interfaces/MongoDB"
import { RatingPositions } from "@util/DBTweaks"
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js"
export default new Command({
    name: "profile",
    nameLocalizations: { "ru": "профиль" },
    description: "Показывает ваш профиль или другого человека",
    run: async ({ interaction, client }) => {
        if (!interaction.inCachedGuild()) return
        await interaction.deferReply({ ephemeral: false })
        const member = interaction.options.getMember('user') || interaction.member
        const data = await client.db.getOne<Guild_User_Interface>('guild-users', { guildID: interaction.guildId, userID: member.id })
        const users = await RatingPositions(member)

        const statuses = {
            online: "<:online:840285081913262110>В сети",
            idle: "<:idle:840285082509246474>Не активен",
            dnd: "<:dnd:840285081229590540>Не беспокоить",
            offline: "<:offline:840285081553207296>Не в сети",
            invisible: "<:offline:840285081553207296>Не в сети",
            null: "<:offline:840285081553207296>Не в сети",
            undefined: "<:offline:840285081553207296>Не в сети"
        }

        const format = (N: number) => new Intl.NumberFormat('ru-RU').format(N)
        const requiredExp = 5 * data.rating.level ** 2 + 50 * data.rating.level + 100
        let totalExp = 0
        for (let i = 0; i < data.rating.level; i++) {
            totalExp += 5 * i ** 2 + 50 * i + 100
        }

        const unixJoinTime = Math.floor(member.joinedTimestamp / 1000)
        const unixRegisterTime = Math.floor(member.user.createdTimestamp / 1000)

        const embed = new EmbedBuilder()
            .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
            .setColor(member.displayColor || 0xffa55a)
            .setThumbnail(member.displayAvatarURL())
            .setDescription(
                "**Основная информация:**" + "\n" +
                `**Имя пользователя:** ${member.user.tag}` + "\n" +
                `**Статус:** ${statuses[member.presence?.status]}` + "\n" +
                `**Присоединился:** <t:${unixJoinTime}:D> (<t:${unixJoinTime}:R>)` + "\n" +
                `**Зарегистрирован:** <t:${unixRegisterTime}:D> (<t:${unixRegisterTime}:R>)`
            )
            .setFooter({ text: `ID: ${member.id}` })
            .addFields([
                { name: "Рейтинг", value: `# ${1 + users.findIndex(x => x.userID === member.id)} из ${users.length}`, inline: true },
                { name: "Уровень", value: `${data.rating.level}`, inline: true },
                { name: "Прогресс", value: `${format(data.rating.exp)} из ${format(requiredExp)} (Всего: ${format(totalExp)})`, inline: true },
                { name: "Наличные", value: `${data.economy.cash}<a:money:840284930563113071>`, inline: true },
                { name: "В банке", value: `${data.economy.bank}<a:money:840284930563113071>`, inline: true }

            ])


        interaction.followUp({ embeds: [embed] })
    },

    dmPermission: false,
    options: [{
        name: "user",
        nameLocalizations: { "ru": "участник" },
        description: "Целевой участник",
        type: ApplicationCommandOptionType.User
    }]
})