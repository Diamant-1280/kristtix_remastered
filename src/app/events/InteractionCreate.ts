import { client } from "@app/index"
import { Event } from "@classes/Event"
import { CommandType, ExtendedInteraction } from "@interfaces/Commands"
import { CommandInteractionOptionResolver, Message } from "discord.js"
export default new Event('interactionCreate', async (interaction) => {
    if (!interaction.inCachedGuild()) {
        if (interaction.isCommand()) interaction.reply("Простите, что вы пытаетесь сделать!?")
        return
    }

    // if (interaction.isSelectMenu()) {
    //     if (interaction.customId.startsWith('vote_')) {
    //         const givedInformation = interaction.customId.split("_")
    //         if (givedInformation.at(1) === 'disabled') {
    //             interaction.reply({
    //                 ephemeral: true,
    //                 content: `<:disabled:918562727134371840> Опрос завершился в <t:${givedInformation.at(2)}:R>!`
    //             })
    //         }
    //     }
    // }

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
        const givenInfo: string[] = interaction.customId.split("_") 
        if (interaction.customId.startsWith("del_")) {
            if (interaction.member.id != givenInfo.at(1)) return interaction.reply({
                ephemeral: true,
                content: "Вы не можете удалить это сообщение, оно вам не пренадлежит!"
            })
            if (givenInfo.at(2)) {
                const msg: Message = interaction.channel.messages.cache.get(givenInfo.at(2))
                if (msg) msg.delete()
                interaction.message.delete()
            }
        }
    }
})