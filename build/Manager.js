"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const discord_js_1 = require("discord.js");
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
(0, dotenv_1.config)();
class Manager extends discord_js_1.ShardingManager {
    constructor() {
        super(path_1.default.join(__dirname, 'app/index.js'), {
            totalShards: 1,
            token: process.env.TOKEN,
            mode: 'process'
        });
        this.on('shardCreate', (shard) => {
            console.log(`[SHARDS] Shard ${shard.id} is created`);
            shard.on('ready', () => {
                console.log(`[SHARDS] Shard ${shard.id} is ready`);
            });
            shard.on('disconnect', () => {
                console.log(`[SHARDS] Shard ${shard.id} was disconnected`);
            });
            shard.on('reconnection', () => {
                console.log(`[SHARDS] Shard ${shard.id} is reconnecting`);
            });
            shard.on('death', () => {
                console.log(`[SHARDS] Shard ${shard.id} is dead`);
            });
        });
        this.spawn({ amount: this.totalShards });
    }
}
exports.Manager = Manager;
new Manager();
//# sourceMappingURL=Manager.js.map