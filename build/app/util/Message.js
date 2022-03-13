"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MongoDB_1 = require("@interfaces/MongoDB");
const discord_js_1 = require("discord.js");
class default_1 {
    constructor(client) {
        this.client = client;
    }
    async message_function(message) {
        if (!message || message.channel.type === 'DM' || !message.guild || !message.member || !message.guild.me || message.author.bot)
            return;
        const [res, data] = await this.database_check(message.guildId, message.author.id, message.guild.ownerId);
        if (data && res) {
            await this.Economy_Update(message, [data, res]);
        }
    }
    async database_check(guildID, userID, ownerID) {
        const { db } = this.client;
        const res = await db.getOrInsert('guilds', { guildID: guildID }, (0, MongoDB_1.Guild_Basic)(guildID, ownerID));
        const data = await db.getOrInsert('users', { guildID: guildID, userID: userID }, (0, MongoDB_1.User_Basic)(userID, guildID));
        return [res, data];
    }
    async Economy_Update(message, [data, res]) {
        const { db } = this.client;
        const givedExp = Math.floor((Math.floor(Math.random() * 11) + 15) * res.Economy.exp_bonus);
        const neededExp = 5 * Math.pow(data.Economy.level, 2) + 50 * data.Economy.level + 100;
        data.Economy.exp += givedExp;
        if (data.Economy.exp >= neededExp) {
            data.Economy.exp = 0;
            data.Economy.level += 1;
            await message.channel.send({ embeds: [new discord_js_1.MessageEmbed().setDescription(`name: ${message.member.displayName}\nexp: ${data.Economy.exp}\nlevel: ${data.Economy.level}`)] });
        }
        console.log(data.Economy);
        await db.save('users', data);
    }
}
exports.default = default_1;
//# sourceMappingURL=Message.js.map