import { client } from "@app/index"
import { Event } from "@classes/Event"
import { CommandType, ExtendedInteraction } from "@interfaces/Commands"
export default new Event('interactionCreate', async (interaction) => {
    if (!interaction.inCachedGuild()) {
        if (interaction.isCommand()) interaction.reply("Простите, что вы пытаетесь сделать!?")
        return
    }

    if (interaction.isCommand()) {
        const command: CommandType = client.commands.get(interaction.commandName)
        if (!command) return interaction.reply("Извините, данная интеграция более не доступна.\nОбратитесь за поддержкой [сюда](https://discord.gg/kuNSEksg)")
        command.run({
            // args: interaction.options as CommandInteractionOptionResolver,
            client,
            interaction: interaction as ExtendedInteraction
        })
    }

    if (!interaction.isButton) {
        
    }
})