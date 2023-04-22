import { Command } from "@classes/Command";
import { UserOption } from "@classes/CommandOptions";
import { Guild_User_Interface } from "@interfaces/MongoDB";
import { errorEmbed } from "@util/replier";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

export default new Command({
  name: "level",
  nameLocalizations: { ru: "уровень" },
  description: "Установите уровень для участника",
  run: async ({ client, interaction }) => {
    if (!interaction.inCachedGuild()) return
    const member = interaction.options.getMember('user')
    if (!member) return interaction.reply({ embeds: errorEmbed('Пользователь не найден!') })
    const level = interaction.options.getInteger('level')

    const data = await client.db.getOne<Guild_User_Interface>('guild-users', { guildID: interaction.guildId, userID: member.id })

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0xffa55a)
          .setTitle("Уровень изменен")
          .setDescription(`Уровень участника <@${member.id}>: **\`${data.rating.level}\`** >>> **\`${level}\`** `)
      ]
    })

    data.rating.level = level
    data.rating.exp = 0

    client.db.save('guild-users', data)
  },
  options: [
    UserOption(),
    {
      name: "level",
      nameLocalizations: { "ru": "уровень" },
      description: "Новый уровень",
      type: ApplicationCommandOptionType.Integer,
      minValue: 0,
      maxValue: 999
    }
  ],
  defaultMemberPermissions: ["ManageGuild"],
  dmPermission: false
})