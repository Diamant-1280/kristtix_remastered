import { client } from "@app/index"
import { Event } from "@classes/Event"
import { ExtendedInteraction } from "@interfaces/Commands"
import { CommandInteractionOptionResolver } from "discord.js"
export default new Event('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        await interaction.deferReply()
        const command = client.commands.get(interaction.commandName)
        if (!command) return interaction.followUp("Извините, данная интеграция более не доступна.\nОбратитесь за поддержкой [сюда](https://discord.gg/kuNSEksg)")
        command.run({
            args: interaction.options as CommandInteractionOptionResolver,
            client,
            interaction: interaction as ExtendedInteraction
        })
    }
})