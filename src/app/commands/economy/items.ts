import { Command } from "@classes/Command";
import { DescriptionOption, NameOption, PriceOption, RoleOption } from "@classes/CommandOptions";
import { Guild_Interface, ShopItem } from "@interfaces/MongoDB";
import { errorEmbed } from "@util/replier";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

export default new Command({
    name: "item",
    nameLocalizations: { ru: "предмет" },
    description: "Управляет предметами в магазине",
    defaultMemberPermissions: ["ManageGuild"],
    dmPermission: false,
    run: async ({ interaction, client }) => {
        if (!interaction.inCachedGuild()) return
        const subCommand = interaction.options.getSubcommand()
        const itemName = interaction.options.getString("name").toLowerCase()
        const newItemName = interaction.options.getString("new-name")?.toLowerCase()
        const itemDescription = interaction.options.getString("description")
        const itemPrice = interaction.options.getInteger("price")
        const itemRole = interaction.options.getRole("role")

        const shop = (await client.db.getOne<Guild_Interface>('guilds', { guildID: interaction.guildId })).shop
        const oldItem = shop.find(item => item.name == itemName)

        const item: ShopItem = {
            name: newItemName || itemName, // новое имя, или имя которое уже есть
            description: itemDescription || oldItem?.description || null, // новое описание или описание существующего предмета если не указано, или ничего
            price: (itemPrice == 0) ? 0 : itemPrice || oldItem?.price || 0, // если новая цена ноль - ноль, если другая - то другая, если нет другой то ноль
            roleID: itemRole?.id || oldItem?.roleID || null //новая роль, если нет, то старая роль, иначе оставить пустым
        }

        const regExp = /[^А-ЯЁа-яё\s\d\w-.]/gi
        if (item.name.match(regExp)?.length) return interaction.reply({
            embeds: errorEmbed(
                "Ошибка названия, найдены недопустимые символы!\n" +
                "Допустимы только буквы и символы: \`[А-Я]\`, \`[A-Z]\`, \`[0-9]\`, \`.\` , \`_\` , \`-\`\n" +
                "В вашем названии использованы запрещенные: " +
                `\`${item.name.match(regExp).join("\` ; \`")}\``
            )
        })

        const embed = new EmbedBuilder()
            .setColor("#ffa55a")
            .setTitle("Информация о предмете")
            .addFields([
                { name: "Название", value: `${item.name}`, inline: true },
                { name: "Цена", value: `<a:money:840284930563113071> ${item.price}`, inline: true },
                { name: "Описание", value: (item.description) ? `${item.description}` : "Описание не задано", inline: !item.description },
                { name: "Роль", value: (item.roleID) ? `<@&${item.roleID}>` : "Роль не указана", inline: true }
            ])

        switch (subCommand) {
            case "add": {
                if (oldItem) return interaction.reply({ embeds: errorEmbed("Данный предмет уже существует!") })
                await client.db.updateOne<Guild_Interface>('guilds', { guildID: interaction.guildId }, { $push: { shop: item } })
                interaction.reply({ content: "Предмет успешно добавлен!", embeds: [embed] })
                break
            }
            case "info": {
                if (!oldItem) return interaction.reply({ embeds: errorEmbed("Такого предмета не существует!") })
                interaction.reply({ embeds: [embed] })
                break
            }
            case "edit": {
                if (!oldItem) return interaction.reply({ embeds: errorEmbed("Такого предмета не существует!") })
                if (JSON.stringify(item) == JSON.stringify(item)) return interaction.reply({ embeds: errorEmbed("Вы не указали никаких изменений!") })
                await client.db.updateOne<Guild_Interface>('guilds', { guildID: interaction.guildId, "shop.name": itemName }, { $set: { "shop.$": item } })
                interaction.reply({ content: "Предмет успешно изменён!", embeds: [embed] })
                break
            }
            case "remove": {
                if (!oldItem) return interaction.reply({ embeds: errorEmbed("Такого предмета не существует!") })
                await client.db.updateOne<Guild_Interface>('guilds', { guildID: interaction.guildId }, { $pull: { shop: { name: item.name } } })
                interaction.reply({ content: `Предмет \`${item.name}\` успешно удалён!` })
                break
            }
        }

    },
    options: [{
        name: 'add',
        nameLocalizations: { ru: "добавить" },
        description: "Добавить новый предмет в магазин",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            NameOption("Название целевого предмета"),
            DescriptionOption("Описание нового предмета"),
            PriceOption("Стоимость нового предмета"),
            RoleOption("Роль к новомо предмета")
        ]
    }, {
        name: 'info',
        nameLocalizations: { ru: "информация" },
        description: "Просмотреть информацию о предмете в магазине",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            NameOption("Название целевого предмета")
        ]
    }, {
        name: 'edit',
        nameLocalizations: { ru: "изменить" },
        description: "Изменить предмет в магазине",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            NameOption("Название целевого предмета"),
            NameOption('Новое название целевого предмета', { name: "new-name", ruName: "новое-название", required: false }),
            DescriptionOption('Новое описание целевого предмета'),
            PriceOption("Новая стоимость целевого предмета"),
            RoleOption("Новая роль целевого предмета")
        ]
    }, {
        name: 'remove',
        nameLocalizations: { ru: "удалить" },
        description: "Удалить предмет из магазина",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            NameOption("Название целевого предмета")
        ]
    }]
})