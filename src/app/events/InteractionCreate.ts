import { client } from "@app/index"
import { Event } from "@classes/Event"
import { CommandType, ExtendedInteraction } from "@interfaces/Commands"
import { SetGuildMember } from "@util/DBTweaks"
import { errorEmbed } from "@util/replier"
export default new Event('interactionCreate', async (interaction) => {
    if (!interaction.inCachedGuild()) return

    if (interaction.isChatInputCommand()) {
        const command: CommandType = client.commands.get(interaction.commandName)
        if (!command) return interaction.reply("Извините, данная интеграция более не доступна.")

        const intMember = interaction.options.getMember('user')
        if (intMember?.user.bot) return interaction.reply({ embeds: errorEmbed("С ботами нельзя взаимодействовать!") })

        if (intMember && intMember?.id != interaction.member.id) await SetGuildMember(intMember)
        await SetGuildMember(interaction.member)
        command.run({
            // args: interaction.options as CommandInteractionOptionResolver,
            client,
            interaction: interaction as ExtendedInteraction
        })
    }
    // del_<автор>_<прикрепленное-сообщение>
    if (interaction.isButton()) {
        const givenInfo: string[] = interaction.customId.split("_") 
        if (interaction.customId.startsWith("del_")) { 
            if (interaction.user.id != givenInfo.at(1)) return interaction.reply({
                ephemeral: true,
                content: "Вы не можете удалить это сообщение, оно вам не пренадлежит!"
            })
            const msg = interaction.channel.messages.cache.get(givenInfo.at(2))
            msg?.delete()
            interaction.message.delete()
        }
    }
})