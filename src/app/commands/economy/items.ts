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
        const item = shop.find(item => item.name == itemName)

        const newItem: ShopItem = {
            name: newItemName || itemName,
            description: itemDescription || item?.description || null,
            price: (itemPrice == 0) ? 0 : itemPrice || item?.price || 0,
            roleID: itemRole?.id || item?.roleID || null
        }

        console.log(newItem)

        const embed = new EmbedBuilder()
            .setColor("#ffa55a")
            .setTitle("Информация о предмете")
            .addFields([
                { name: "Название", value: `${newItem.name}`, inline: true },
                { name: "Цена", value: `<a:money:840284930563113071> ${newItem.price}`, inline: true },
                { name: "Описание", value: (newItem.description) ? `${newItem.description}` : "Описание не задано", inline: !newItem.description },
                { name: "Роль", value: (newItem.roleID) ? `<@&${newItem.roleID}>` : "Роль не указана", inline: true }
            ])

        switch (subCommand) {
            case "add": {
                if (item) return interaction.reply({ content: "Данный предмет уже существует!", ephemeral: true })
                await client.db.updateOne<Guild_Interface>('guilds', { guildID: interaction.guildId }, { $push: { shop: newItem } })
                interaction.reply({ content: "Предмет успешно добавлен!", embeds: [embed], ephemeral: true })
                break
            }
            case "info": {
                if (!item) return interaction.reply({ content: "Такого предмета не существует!", ephemeral: true })
                interaction.reply({ embeds: [embed], ephemeral: true })
                break
            }
            case "edit": {
                if (!item) return interaction.reply({ content: "Такого предмета не существует!", ephemeral: true })
                if (JSON.stringify(item) == JSON.stringify(newItem)) return interaction.reply("Вы не указали никаких изменений!")
                // if (!itemDescription && !itemRole ) return interaction.reply("Вы не указали ни одного аргумента который следовало бы изменить!")
                await client.db.updateOne<Guild_Interface>('guilds', { guildID: interaction.guildId, "shop.name": itemName }, { $set: { "shop.$": newItem } })
                interaction.reply({ content: "Предмет успешно изменён!", embeds: [embed], ephemeral: true })
                break
            }
            case "remove": {
                if (!item) return interaction.reply({ content: "Такого предмета не существует!", ephemeral: true })
                await client.db.updateOne<Guild_Interface>('guilds', { guildID: interaction.guildId }, { $pull: { shop: { name: itemName } } })
                interaction.reply({ content: `Предмет \`${newItem.name}\` успешно удалён!`, ephemeral: true })
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