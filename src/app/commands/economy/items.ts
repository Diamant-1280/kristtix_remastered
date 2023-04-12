import { Command } from "@classes/Command";
import { Guild_Interface, ShopItem } from "@interfaces/MongoDB";
import { ApplicationCommandOptionData, ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

const nameOption: ApplicationCommandOptionData = {
    name: "name",
    nameLocalizations: { ru: "название" },
    description: "Укажите название предмета (до 30 символов)",
    maxLength: 30,
    type: ApplicationCommandOptionType.String,
    required: true
}

const newNameOption: ApplicationCommandOptionData = {
    name: "new-name",
    nameLocalizations: { ru: "новое-название" },
    description: "Укажите новое название предмета (до 30 символов)",
    maxLength: 30,
    type: ApplicationCommandOptionType.String
}

const descriptionOption: ApplicationCommandOptionData = {
    name: "description",
    nameLocalizations: { ru: "описание" },
    description: "Укажите описание предмета (до 75 символов)",
    maxLength: 75,
    type: ApplicationCommandOptionType.String
}

const priceOption: ApplicationCommandOptionData = {
    name: "price",
    nameLocalizations: { ru: "стоимость" },
    description: "Укажите стоимость предмета",
    type: ApplicationCommandOptionType.Integer
}

const roleOption: ApplicationCommandOptionData = {
    name: "role",
    nameLocalizations: { ru: "роль" },
    description: "Прикрепите роль к предмету",
    type: ApplicationCommandOptionType.Role,
}

export default new Command({
    name: "item",
    nameLocalizations: { ru: "предмет" },
    description: "Управляет предметами в магазине",
    defaultMemberPermissions: ["ManageGuild"],
    dmPermission: false,
    run: async ({ interaction, client }) => {
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
        if (item.name.match(regExp)?.length) return interaction.reply({ content: "Ошибка названия, найдены недопустимые символы!\nДопустимы только буквы и символы: \`[А-Я]\`, \`[A-Z]\`, \`[0-9]\`, \`.\` , \`_\` , \`-\`\nВ вашем названии использованы запрещенные: " + `\`${item.name.match(regExp).join("\` , \`")}\``, ephemeral: true })

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
                if (oldItem) return interaction.reply({ content: "Данный предмет уже существует!", ephemeral: true })
                await client.db.updateOne<Guild_Interface>('guilds', { guildID: interaction.guildId }, { $push: { shop: item } })
                interaction.reply({ content: "Предмет успешно добавлен!", embeds: [embed], ephemeral: true })
                break
            }
            case "info": {
                if (!oldItem) return interaction.reply({ content: "Такого предмета не существует!", ephemeral: true })
                interaction.reply({ embeds: [embed], ephemeral: true })
                break
            }
            case "edit": {
                if (!oldItem) return interaction.reply({ content: "Такого предмета не существует!", ephemeral: true })
                if (JSON.stringify(item) == JSON.stringify(item)) return interaction.reply("Вы не указали никаких изменений!")
                await client.db.updateOne<Guild_Interface>('guilds', { guildID: interaction.guildId, "shop.name": itemName }, { $set: { "shop.$": item } })
                interaction.reply({ content: "Предмет успешно изменён!", embeds: [embed], ephemeral: true })
                break
            }
            case "remove": {
                if (!oldItem) return interaction.reply({ content: "Такого предмета не существует!", ephemeral: true })
                await client.db.updateOne<Guild_Interface>('guilds', { guildID: interaction.guildId }, { $pull: { shop: { name: item.name } } })
                interaction.reply({ content: `Предмет \`${item.name}\` успешно удалён!`, ephemeral: true })
                break
            }
        }

    },
    options: [{
        name: 'add',
        nameLocalizations: { ru: "добавить" },
        description: "Добавить предмет в магазин",
        type: ApplicationCommandOptionType.Subcommand,
        options: [nameOption, descriptionOption, priceOption, roleOption]
    }, {
        name: 'info',
        nameLocalizations: { ru: "информация" },
        description: "Посмотреть предмет в магазина",
        type: ApplicationCommandOptionType.Subcommand,
        options: [nameOption]
    }, {
        name: 'edit',
        nameLocalizations: { ru: "изменить" },
        description: "Изменить предмет в магазине",
        type: ApplicationCommandOptionType.Subcommand,
        options: [nameOption, descriptionOption, priceOption, roleOption, newNameOption]
    }, {
        name: 'remove',
        nameLocalizations: { ru: "удалить" },
        description: "Удалить предмет из магазина",
        type: ApplicationCommandOptionType.Subcommand,
        options: [nameOption]
    }]
})