import { Command } from "@classes/Command";
import { GuildMember, User } from "discord.js";
import path from 'path'
import { client } from "@app/index";
import { createCanvas, loadImage, registerFont } from 'canvas'
import { User_Interface } from "@interfaces/MongoDB";
export default new Command({
    name: "rank",
    description: "Показывает карточку ранга выбранного участника (или у вас)",
    options: [{
        name: "user",
        description: "Пользователь, ранг которого вы хотите посмотреть (оставьте пустым чтобы посмотреть свой ранг)",
        type: "USER"
    }],
    run: async ({ interaction }) => {
        const user: User = interaction.options.getUser('user', false) || interaction.user
        const member: GuildMember = interaction.guild.members.cache.get(user.id)
        if (user.bot) return interaction.reply("Боты не учавствуют в рейтинге, вы не можете запросить его карточку ранга!")
        // await interaction.deferReply({ ephemeral: true })
        const data = await client.db.getOne<User_Interface>('users', { guildID: interaction.guildId, userID: member.id })

        const avatar = loadImage(user.displayAvatarURL({ format: "png", size: 512 }))
        const banner = loadImage("https://images-ext-1.discordapp.net/external/vXYC5g1QJc_1SYWELqKbsxOe6pTVxKlf-mfAyvDWuks/%3Fwidth%3D716%26height%3D403/https/media.discordapp.net/attachments/724940553535488041/917212251059003432/568425892.jpg")
        const color = "#5555ffff"
        const neededExp = 5 * Math.pow(data.Economy.level, 2) + 50 * data.Economy.level + 100
        const progress = Math.round(1210 * data.Economy.exp / neededExp)

        const canvas = createCanvas(1920, 1080)
        const context = canvas.getContext('2d')
        await registerFont(path.join(__dirname, "../../../../Comfortaa-bold.ttf"), { family: "Comfortaa" })

        context.drawImage(banner, 0, 0, 1920, 1080)
        context.fillStyle = "#55555555"
        context.fillRect(0, 620, 1920, 460)

        context.fillStyle = '#ffffffff'
        context.font = "70px Comfortaa"
        context.fillText(member.displayName, 640, 763)
        context.font = "80px Comfortaa"
        context.fillText(`lv. ${data.Economy.level}`, 640, 915)
        context.fillText(`${data.Economy.exp} / ${neededExp} exp`, (1920 - 70) - context.measureText(`${data.Economy.exp} / ${neededExp} exp`).width, 915)

        function fillRoundedRect(x: number, y: number, w: number, h: number, r: number) {
            context.beginPath()
            context.moveTo(x + (w / 2), y)
            context.arcTo(x + w, y, x + w, y + (h / 2), r)
            context.arcTo(x + w, y + h, x + (w / 2), y + h, r)
            context.arcTo(x, y + h, x, y + (h / 2), r)
            context.arcTo(x, y, x + (w / 2), y, r)
            context.closePath()
            context.fill()
        }

        context.fillStyle = "#999999ff"
        fillRoundedRect(640, 950, 1210, 80, 40)

        context.fillStyle = color
        if (progress >= 80) fillRoundedRect(640, 950, progress, 80, 40)

        context.beginPath()
        context.arc(300, 780, 270, 0, Math.PI * 2, true)
        context.clip()
        context.closePath()
        context.fillStyle = "#555555ff"
        context.fillRect(30, 510, 540, 540)

        context.beginPath()
        context.arc(300, 780, 250, 0, Math.PI * 2, true)
        context.clip()
        context.closePath()
        context.drawImage(avatar, 50, 530, 500, 500)
        const file = canvas.toBuffer()

        interaction.reply({ content: null, files: [file], ephemeral: true })
    }
})