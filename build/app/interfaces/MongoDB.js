"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User_Basic = exports.Guild_Basic = void 0;
function Guild_Basic(id, owner_id) {
    return {
        guildID: id,
        ownerID: owner_id,
        blocked_commands: [],
        Economy: {
            bank: 10000,
            exp_bonus: 1.0,
            shop: Object()
        }
    };
}
exports.Guild_Basic = Guild_Basic;
function User_Basic(user_id, guild_id) {
    return {
        userID: user_id,
        guildID: guild_id,
        Economy: {
            balance: 0,
            exp: 0,
            level: 0,
            rep: 0
        }
    };
}
exports.User_Basic = User_Basic;
//# sourceMappingURL=MongoDB.js.map