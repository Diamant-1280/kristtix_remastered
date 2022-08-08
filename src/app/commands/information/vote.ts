import { Command } from "@classes/Command";
import { ApplicationCommandOptionType } from "discord.js";

export default new Command({
    name: "vote",
    nameLocalizations: { ru: "голосование" },
    description: "Создает сообщение с голосованием",
    run: ({ args }) => {
        console.log(args)


    },
    options: [
        {
            name: "question",
            nameLocalizations: { ru: "вопрос" },
            description: "Укажите сообщение с вопросом",
            type: ApplicationCommandOptionType.String,
            required: true
        }, {
            name: "1st_answer",
            nameLocalizations: {ru: "первый_ответ"},
            description: "Укажите текст первого ответа",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "2nd_answer",
            nameLocalizations: {ru: "второй_ответ"},
            description: "Укажите текст первого ответа",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "3rd_answer",
            nameLocalizations: {ru: "третий_ответ"},
            description: "Укажите текст первого ответа",
            type: ApplicationCommandOptionType.String,
        }, {
            name: "4th_answer",
            nameLocalizations: {ru: "четвертый_ответ"},
            description: "Укажите текст первого ответа",
            type: ApplicationCommandOptionType.String,
        }, {
            name: "5th_answer",
            nameLocalizations: {ru: "пятый_ответ"},
            description: "Укажите текст первого ответа",
            type: ApplicationCommandOptionType.String,
        }
    ]
})