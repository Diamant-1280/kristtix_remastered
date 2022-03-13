import { Command } from "@classes/Command";

export default new Command({
    name: "ping",
    description: "Return pong",
    run: async({ interaction }) => {
        interaction.reply({ content: "Pong!"})
    },
    cooldown: 10000
})