import { Command } from "@classes/Command";
import { ActionRowBuilder, ApplicationCommandOptionType, ComponentType, EmbedBuilder, Interaction, InteractionCollector, SelectMenuBuilder, SelectMenuComponentOptionData, SelectMenuInteraction } from "discord.js";
export default new Command({
    name: "vote",
    nameLocalizations: { ru: "голосование" },
    description: "Создает сообщение с голосованием",
    run: async ({ interaction }) => {
        if (!interaction.inCachedGuild) return
        const question = interaction.options.getString('question')
        const alreadyVoted: Set<string> = new Set() 

        const embed: EmbedBuilder = new EmbedBuilder()
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL()
            })

        if (question.length <= 256) embed.setTitle(question)
        else embed.setDescription(question)

        const answerPrefixes: string[] = ['1st', '2nd', '3rd', '4th', '5th']
        const voited: number[] = [0, 0, 0, 0, 0]
        const emojis: string[] = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"]

        async function createMessageActionRow(): Promise<ActionRowBuilder<SelectMenuBuilder>> {
            const answers: string[] = answerPrefixes.map(x => {
                return interaction.options.getString(`${x}_answer`)
            }).filter(x => x)

            const selectComponents: Array<SelectMenuComponentOptionData> = answers.map((x, i) => {
                return {
                    label: `[${voited[i]}] ${answers[i]}`,
                    value: answerPrefixes[i],
                    emoji: emojis[i]
                }
            })

            const selectMenu: SelectMenuBuilder = new SelectMenuBuilder().addOptions(selectComponents).setCustomId(`vote_${interaction.id}`)

            const actionRow: ActionRowBuilder<SelectMenuBuilder> = new ActionRowBuilder<SelectMenuBuilder>().addComponents(selectMenu)

            return actionRow
        }

        const oldActionRow = await createMessageActionRow()

        interaction.reply({ embeds: [embed], components: [oldActionRow] })

        const collector: InteractionCollector<SelectMenuInteraction> = interaction.channel.createMessageComponentCollector({
            filter: int => int.customId == `vote_${interaction.id}`,
            componentType: ComponentType.SelectMenu
            
        })

        collector.on('collect', async (int) => {
            if (!int.inCachedGuild()) return
            if (alreadyVoted.has(int.member.id)) int.reply({ content: "Вы уже проголосовали!", ephemeral: true})
            else int.reply({ content: "Ваш голос сохранён!", ephemeral: true })

            switch (int.values[0]) {
                case '1st': voited[0] += 1; break
                case '2nd': voited[1] += 1; break
                case '3rd': voited[2] += 1; break
                case '4th': voited[3] += 1; break
                case '5th': voited[4] += 1; break
            }

            alreadyVoted.add(int.user.id)
            
            const newActionRow = await createMessageActionRow()
            interaction.editReply({ embeds: [embed], components: [newActionRow] })
        })


    },
    options: [
        {
            name: "question",
            nameLocalizations: { ru: "вопрос" },
            description: "Укажите сообщение с вопросом",
            type: ApplicationCommandOptionType.String,
            required: true,
            minLength: 10,
            maxLength: 500
        }, {
            name: "1st_answer",
            nameLocalizations: { ru: "первый_ответ" },
            description: "Укажите текст первого ответа",
            type: ApplicationCommandOptionType.String,
            required: true,
            maxLength: 256
        },
        {
            name: "2nd_answer",
            nameLocalizations: { ru: "второй_ответ" },
            description: "Укажите текст второго ответа",
            type: ApplicationCommandOptionType.String,
            required: true,
            maxLength: 256
        },
        {
            name: "3rd_answer",
            nameLocalizations: { ru: "третий_ответ" },
            description: "Укажите текст третьего ответа",
            type: ApplicationCommandOptionType.String,
            maxLength: 256
        }, {
            name: "4th_answer",
            nameLocalizations: { ru: "четвертый_ответ" },
            description: "Укажите текст четвертого ответа",
            type: ApplicationCommandOptionType.String,
            maxLength: 256
        }, {
            name: "5th_answer",
            nameLocalizations: { ru: "пятый_ответ" },
            description: "Укажите текст пятого ответа",
            type: ApplicationCommandOptionType.String,
            maxLength: 256
        }
    ],

})