import { Command } from "@classes/Command";
import { ApplicationCommandOptionType, GuildMember, HexColorString, User } from "discord.js";
import { Canvas, createCanvas, loadImage, CanvasRenderingContext2D, Image } from 'canvas'
import { User_Basic, User_Interface } from "@interfaces/MongoDB";
export default new Command({
    name: "ранг",
    description: "Показывает карточку ранга выбранного участника (или у вас)",
    options: [{
        name: "user",
        description: "Участник, ранг которого вы хотите посмотреть",
        type: ApplicationCommandOptionType.User,
        nameLocalizations: { ru: "участник", "en-US": "участник" }
    }, {
        name: "hide",
        description: "Укажите, нужно ли отослать результат команды всем в чате",
        type: ApplicationCommandOptionType.Boolean,
        nameLocalizations: { ru: "скрыть", "en-US": "скрыть"}
    }],

    run: async ({ interaction, client }) => {
        const user: User = interaction.options.getUser('user', false) || interaction.user
        const hide: boolean = interaction.options.getBoolean('hide', false) || false

        await interaction.deferReply({ ephemeral: hide })

        const member: GuildMember = interaction.guild.members.cache.get(user.id)
        if (user.bot) return interaction.followUp({ content: "Боты не учавствуют в рейтинге, вы не можете запросить карточку ранга!", ephemeral: true})
        const data = await client.db.getOrInsert<User_Interface>('users', { guildID: interaction.guildId, userID: member.id }, User_Basic(user.id, interaction.guildId))

        const avatar: Image = await loadImage(user.displayAvatarURL({ extension: "png" , size: 512 }))
        const banner: Image = await loadImage(data.RankCard.bannerURL)
        const color: HexColorString = data.RankCard.hexColor
        const neededExp: number = 5 * Math.pow(data.Economy.level, 2) + 50 * data.Economy.level + 100
        const progress: number = Math.round(1210 * data.Economy.exp / neededExp)

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
        ctx.fillText(`lv. ${data.Economy.level}`, 640, 915)
        ctx.fillText(`${data.Economy.exp} / ${neededExp} exp`, (1920 - 70) - ctx.measureText(`${data.Economy.exp} / ${neededExp} exp`).width, 915)

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

        interaction.editReply({ content: null, files: [file] })
    }
})