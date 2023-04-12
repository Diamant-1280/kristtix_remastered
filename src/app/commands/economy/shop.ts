import { client } from "@app/index";
import { Command } from "@classes/Command";
import { Guild_Basic, Guild_Interface } from "@interfaces/MongoDB";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, EmbedField } from "discord.js";

export default new Command({
    name: "shop",
    nameLocalizations: { ru: "магазин" },
    description: "Показывает список доступных предметов",
    run: async ({ interaction }) => {
        if (!interaction.inCachedGuild()) return
        let currentPage = 1
        const maxElementsOnPage = 1
        const shopItems = (await client.db.getOrInsert<Guild_Interface>('guilds', { guildID: interaction.guild.id }, Guild_Basic(interaction.guild.id))).shop

        if (!shopItems.length) return interaction.reply("Магазин пуст, нет предметов для покупки!")

        const embedFields: EmbedField[] = shopItems.map(item => ({
            name: `${item.name} - <a:money:840284930563113071> ${item.price}`,
            value: item.description || "Описание не указано",
            inline: true
        }))

        const pagesCount = Math.ceil(embedFields.length / maxElementsOnPage)
        const pages: EmbedBuilder[] = []

        for (let page = 0; page < pagesCount; page++) {
            pages.push(
                new EmbedBuilder()
                    .setColor('#ffa55a')
                    .setAuthor({ name: "Магазин предметов", iconURL: interaction.guild.iconURL() })
                    .setFields(embedFields.slice(maxElementsOnPage * page, maxElementsOnPage * (page + 1)))
                // .setFooter({ text: `Страница ${page + 1} из ${pagesCount}` })
            )
        }

        const toLeftButton = new ButtonBuilder()
            .setCustomId('toLeft')
            .setEmoji('<:to_left:873618668582502452>')
            .setStyle(ButtonStyle.Secondary)

        const pageCounterButton = new ButtonBuilder()
            .setCustomId('counter')
            .setLabel(`${currentPage} / ${pagesCount}`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)

        const toRigthButton = new ButtonBuilder()
            .setCustomId('toRight')
            .setEmoji('<:to_rigth:873618668657975387>')
            .setStyle(ButtonStyle.Secondary)

        const toCancelButton = new ButtonBuilder()
            .setCustomId(`toCancel`)
            .setEmoji('<:cancel:873618668574101584>')
            .setStyle(ButtonStyle.Danger)

        toLeftButton.setDisabled(currentPage === 1)
        toRigthButton.setDisabled(currentPage === pagesCount)

        const actionRow = new ActionRowBuilder<ButtonBuilder>()
            .setComponents([toLeftButton, pageCounterButton, toRigthButton, toCancelButton])

        const message = await interaction.reply({ embeds: [pages[currentPage - 1]], components: [actionRow], fetchReply: true })
        const collector = message.createMessageComponentCollector({
            filter: int => interaction.member.id === int.user.id,
            componentType: ComponentType.Button,
            idle: 5 * 60 * 1000,
            time: 15 * 60 * 1000
        })

        collector.on('collect', int => {
            switch (int.customId) {
                case 'toLeft': currentPage--; int.deferUpdate(); break
                case 'toRight': currentPage++; int.deferUpdate(); break
                case 'toCancel': collector.stop("cancel"); interaction.deleteReply(); return
            }

            toLeftButton.setDisabled(currentPage === 1)
            toRigthButton.setDisabled(currentPage === pagesCount)
            pageCounterButton.setLabel(`${currentPage} / ${pagesCount}`)
            actionRow.setComponents([toLeftButton, pageCounterButton, toRigthButton, toCancelButton])
            interaction.editReply({ embeds: [pages[currentPage - 1]], components: [actionRow] })
        })

        collector.on('end', (_int, reason) => {
            if (reason != 'cancel') {
                toLeftButton.setDisabled(true)
                toRigthButton.setDisabled(true)
                toCancelButton.setDisabled(true)
                actionRow.setComponents([toLeftButton, pageCounterButton, toRigthButton, toCancelButton])
                interaction.editReply({ embeds: [pages[currentPage - 1]], components: [actionRow] })
            }
        })
    }, dmPermission: false
})