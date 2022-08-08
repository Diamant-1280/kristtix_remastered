import { client } from "@app/index"
import { Event } from "@classes/Event"
import { CommandType, ExtendedInteraction } from "@interfaces/Commands"
import { CommandInteractionOptionResolver, Message } from "discord.js"
export default new Event('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        const command: CommandType = client.commands.get(interaction.commandName)
        if (!command) return interaction.reply("Извините, данная интеграция более не доступна.\nОбратитесь за поддержкой [сюда](https://discord.gg/kuNSEksg)")
        command.run({
            args: interaction.options as CommandInteractionOptionResolver,
            client,
            interaction: interaction as ExtendedInteraction
        })
    }

    if (interaction.isButton()) {
        if (interaction.customId.startsWith("del_")) {
            if (interaction.user.id != interaction.customId.slice(23, 41)) return interaction.followUp({
                ephemeral: true,
                content: "Вы не можете удалить это сообщение, оно вам не пренадлежит!"
            })
            const msgId: string = interaction.customId.slice(4, 22)
            await interaction.channel.messages.fetch(msgId)
            const msg: Message = interaction.channel.messages.cache.get(msgId)
            if (msg.deletable) msg.delete()
            interaction.message.delete()
        }
    }
})