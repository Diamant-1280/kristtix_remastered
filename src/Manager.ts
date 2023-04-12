import { Shard, ShardingManager } from 'discord.js'
import { config } from 'dotenv'
import path from 'path'

config()

export class Manager extends ShardingManager {
	public constructor() {
		super(path.join(__dirname, 'app/index.js'), {
			totalShards: 1,
			token: process.env.DISCORD_CLIENT_TOKEN,
			mode: 'process'
		})
		this.on('shardCreate', (shard: Shard) => {
			console.log(`[SHARDS] Shard ${shard.id} is created`)
			shard.on('ready', () => {
				console.log(`[SHARDS] Shard ${shard.id} is ready`)
			})
			shard.on('disconnect', () => {
				console.log(`[SHARDS] Shard ${shard.id} was disconnected`)
			})
			shard.on('reconnecting', () => {
				console.log(`[SHARDS] Shard ${shard.id} is reconnecting`)
			})
			shard.on('death', () => {
				console.log(`[SHARDS] Shard ${shard.id} is dead`)
			})
		})
		this.spawn({ amount: this.totalShards })
	}
}

new Manager()