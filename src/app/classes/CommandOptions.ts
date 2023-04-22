import { ApplicationCommandNumericOptionData, ApplicationCommandOptionData, ApplicationCommandOptionType, ApplicationCommandRoleOptionData, ApplicationCommandStringOptionData } from "discord.js";

export function UserOption(
	required = true,
	description = "Целевой участник",
): ApplicationCommandOptionData {
	return {
		name: "user",
		nameLocalizations: { 'ru': "участник" },
		description: description,
		type: ApplicationCommandOptionType.User,
		required: required
	}
}

export function ShowOption(): ApplicationCommandOptionData {
	return {
		name: "show",
		nameLocalizations: { 'ru': "показать" },
		description: "Показать результат команды всем в чате",
		type: ApplicationCommandOptionType.String,
		choices: [
			{
				name: "show",
				nameLocalizations: { ru: "показать" },
				value: "true",
			},
			{
				name: "hide",
				nameLocalizations: { ru: "скрыть" },
				value: "false"
			}
		]
	}
}

export function NameOption(
	description: string,
	param: { name?: string, ruName?: string, min?: number, max?: number, required?: boolean } = { name: 'name', ruName: "название", min: 3, max: 30, required: true }
): ApplicationCommandOptionData & ApplicationCommandStringOptionData {
	return {
		name: param.name,
		nameLocalizations: { 'ru': param.ruName },
		description: description,
		minLength: param.min,
		maxLength: param.max,
		type: ApplicationCommandOptionType.String,
		required: param.required
	}
}

export function DescriptionOption(
	description: string,
	param: { min?: number, max?: number, required?: boolean } = { min: 3, max: 75, required: false }
): ApplicationCommandOptionData & ApplicationCommandStringOptionData {
	return {
		name: "description",
		nameLocalizations: { 'ru': "описание" },
		description: description,
		minLength: param.min,
		maxLength: param.max,
		type: ApplicationCommandOptionType.String,
		required: param.required
	}
}

export function PriceOption(
	description: string,
	required = false
): ApplicationCommandOptionData & ApplicationCommandNumericOptionData {
	return {
		name: "price",
		nameLocalizations: { 'ru': "цена" },
		description: description,
		type: ApplicationCommandOptionType.Integer,
		required: required
	}
}

export function RoleOption(
	description: string,
	required = false
): ApplicationCommandOptionData & ApplicationCommandRoleOptionData {
	return {
		name: "role",
		nameLocalizations: { 'ru': "роль" },
		description: description,
		type: ApplicationCommandOptionType.Role,
		required: required
	}
}