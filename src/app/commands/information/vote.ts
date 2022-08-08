import { Command } from "@classes/Command";

export default new Command({
    name: "vote",
    nameLocalizations: { ru: "голосование" },
    description: "Создает сообщение с голосованием",
    run: ({ args }) => {
        console.log(args)
    },
})