import { Command } from "@classes/Command";

export default new Command({
    name: "ping",
    description: "Отправляет вам в ебало pong x2",
    run: async({ interaction }) => {
        interaction.followUp('Pong! Pong!')
    },
    cooldown: 10000
})