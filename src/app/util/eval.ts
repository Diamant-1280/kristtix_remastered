import { AttachmentBuilder, Message } from "discord.js";
export default async function Eval(message: Message): Promise<void> {
    const args: string[] = message.content.slice(5, message.content.length -3).trim().split(" ")
    const code: string = args.join(" ")
    async function clean(code: string): Promise<string> {
        if (code && code.constructor.name == "Promise")
            code = await code;
        if (typeof code !== "string")
            code = require("util").inspect(code, { depth: 0 })
        code = code.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        return code;
    }

    try {
        const evaled: any = args.includes("await") ? eval(`(async () => { ${code} })()`) : eval(code), cleaned = await clean(evaled);
        const text: string = cleaned.length > 2000 ? "Текст содержит более 2к символов блэт. Выслан ебучий файл." : cleaned;
        const file: any = cleaned.length > 2000 ? [new AttachmentBuilder(Buffer.from(`${cleaned}`), { name: "Код дебила.js" })] : [];
        await message.reply({ content: `\`\`\`js\n${text}\n\`\`\``, files: file })
    } catch (err) {
        message.channel.send({ content: `\`ERROR\`\n\`\`\`x1\n${err}\n\`\`\`` })
    }
}
// }