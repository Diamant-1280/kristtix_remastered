import { client } from "@app/index";
import { Command } from "@classes/Command";
import { MessageEmbed } from "discord.js";

export default new Command({
    name: "info",
    description: "shows bot information",
    run: async ({ interaction }) => {
        await interaction.deferReply()
        function msConverter(milliseconds: number) {
            const d = Math.trunc(milliseconds / 86400000),
                dm = (d == 1) ? "day" : "days",
                h = Math.trunc(milliseconds / 3600000) % 24,
                hm = (h == 1) ? "hour" : "hours",
                m = Math.trunc(milliseconds / 60000) % 60,
                mm = (m == 1) ? "minute" : "minutes",
                s = Math.trunc(milliseconds / 1000) % 60,
                sm = (s == 1) ? "second" : "seconds";

            if (d > 0) return `${d} ${dm}`
            else if (h > 0) return `${h} ${hm}`
            else if (m > 0) return `${m} ${mm}`
            else return `${s} ${sm}`
        }

        const usedRam = process.memoryUsage().heapUsed / 1024 / 1024;
        const embed = new MessageEmbed()
            .setAuthor({ name: "Статистика", iconURL: "https://media.discordapp.net/attachments/686585233339842572/708783669766258708/bot_gray.png" })
            .addField("Серверов", `${client.guilds.cache.size}`, true)
            .addField("Пользователей", `${client.guilds.cache.reduce((a: number, g) => a + g.memberCount)}`, true)
            .addField("Памяти использовано", `${Math.round(usedRam * 100) / 100} МБ`, true)
            .addField("Задержка", `${client.ws.ping} мс`, true)
            .addField("Время работы", msConverter(client.uptime), true)
            .setFooter({ text: "Diamant#5228", iconURL: "https://cdn.discordapp.com/avatars/516654639480045588/9cfb1c3c5b18c59eda1163bc39515d91.png?size=512" })
        interaction.reply({ embeds: [embed] })
        interaction.channel.send({ embeds: [embed] })
    },
    type: "CHAT_INPUT"
})


