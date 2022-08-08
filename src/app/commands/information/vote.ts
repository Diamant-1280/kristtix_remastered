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
            name: "1st-answer",
            nameLocalizations: {ru: "первый ответ"},
            description: "Укажите текст первого ответа",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "2nd-answer",
            nameLocalizations: {ru: "второй ответ"},
            description: "Укажите текст первого ответа",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "3rd-answer",
            nameLocalizations: {ru: "третий ответ"},
            description: "Укажите текст первого ответа",
            type: ApplicationCommandOptionType.String,
        }, {
            name: "4th-answer",
            nameLocalizations: {ru: "четвертый ответ"},
            description: "Укажите текст первого ответа",
            type: ApplicationCommandOptionType.String,
        }, {
            name: "5th-answer",
            nameLocalizations: {ru: "пятый ответ"},
            description: "Укажите текст первого ответа",
            type: ApplicationCommandOptionType.String,
        }
    ]
})