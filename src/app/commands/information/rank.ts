import { Command } from "@classes/Command";
import { GuildMember, HexColorString } from "discord.js";
import { Canvas, createCanvas, loadImage, CanvasRenderingContext2D, Image } from 'canvas'
import { User_Basic, User_Interface, Guild_User_Interface } from "@interfaces/MongoDB";
import { RatingPositions } from "@util/DBTweaks";
import { UserOption, ShowOption } from "@classes/CommandOptions";
export default new Command({
    name: "rank",
    nameLocalizations: { ru: "ранг" },
    description: "Показывает карточку ранга выбранного участника (или у вас)",
    options: [ UserOption(false), ShowOption() ],

    run: async ({ interaction, client }) => {
        if (!interaction.inCachedGuild()) return
        const member: GuildMember = interaction.options.getMember('user') || interaction.member
        const show: boolean = (interaction.options.getString('show')  == 'true') ? true : false
        await interaction.deferReply({ ephemeral: !show })

        // данные участника на сервере
        const data = await client.db.getOne<Guild_User_Interface>('guild-users', { guildID: interaction.guild.id, userID: member.id })
        const avatar: Image = await loadImage(member.user.displayAvatarURL({ extension: "png", size: 512 }))
        const neededExp: number = 5 * Math.pow(data.rating.level, 2) + 50 * data.rating.level + 100
        const progress: number = Math.round(1210 * data.rating.exp / neededExp)
        const users: Guild_User_Interface[] = await RatingPositions(interaction.member)
        const position: number = users.findIndex(user => user.userID === member.id)

        // глоабльаные данные участника
        const userData = await client.db.getOrInsert<User_Interface>('users', { userID: member.id }, User_Basic(member.id))
        const banner: Image = await loadImage(userData.rankCard.url)
        const color: HexColorString = userData.rankCard.color

        // функция рисования скруленного прямоугольника
        function fillRoundedRect(x: number, y: number, w: number, h: number, r: number) {
            ctx.beginPath()
            ctx.moveTo(x + (w / 2), y)
            ctx.arcTo(x + w, y, x + w, y + (h / 2), r)
            ctx.arcTo(x + w, y + h, x + (w / 2), y + h, r)
            ctx.arcTo(x, y + h, x, y + (h / 2), r)
            ctx.arcTo(x, y, x + (w / 2), y, r)
            ctx.closePath()
            ctx.fill()
        }

        // Иницилизация канваса
        const canvas: Canvas = createCanvas(1920, 1080)
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')

        // Рисуем задник
        ctx.drawImage(banner, 0, 0, 1920, 1080)
        ctx.fillStyle = "#55555555"
        ctx.fillRect(0, 620, 1920, 460)

        // Рисуем текст
        ctx.fillStyle = '#ffffffff'
        ctx.font = "70px Comfortaa"
        ctx.fillText(member.displayName, 640, 763)
        ctx.font = "80px Comfortaa"
        ctx.fillText(`lv. ${data.rating.level} #${position +1}`, 640, 900)
        ctx.fillText(`${data.rating.exp} / ${neededExp} exp`, (1920 - 70) - ctx.measureText(`${data.rating.exp} / ${neededExp} exp`).width, 900)

        // Сохранение области редактирования 
        ctx.save()

        // Рисуем прогресса бар
        ctx.fillStyle = "#999999ff"
        fillRoundedRect(640, 950, 1210, 80, 40)
        // вырезаем область редактирования
        ctx.clip()
        // Рисуем прогресс
        ctx.fillStyle = color
        fillRoundedRect(640, 950, progress, 80, 40)

        // возвращаем область редактирования
        ctx.restore()

        // рисуем круг вокруг аватарки и обрезаем до круга
        ctx.beginPath()
        ctx.arc(300, 780, 270, 0, Math.PI * 2, true)
        ctx.clip()
        ctx.closePath()
        ctx.fillStyle = "#555555ff"
        ctx.fillRect(30, 510, 540, 540)

        // Рисуем аватарку и обрезаем до круга
        ctx.beginPath()
        ctx.arc(300, 780, 250, 0, Math.PI * 2, true)
        ctx.clip()
        ctx.closePath()
        ctx.drawImage(avatar, 50, 530, 500, 500)
        const file = canvas.toBuffer()

        interaction.followUp({ content: null, files: [file] })
    },
    dmPermission: false
})