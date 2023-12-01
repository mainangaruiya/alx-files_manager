import {createClient} from 'redis';
import { promisfy} from 'util'

class RedisClient {
	constructor() {
		this.client = createClient();
		this.client.on('error', (error) => {
			console.log('Redis client is not connected to the server: ${error}');
		});
	}

	isAlive() {
		if (this.client.connected) {
			return true;
		}
		return false;
	}

	async get(key) {
		const redisGet = promisfy(this.client.get).bind(this.client);
		const value = await redisGet(key);
		return value;
	}
	async set(key, value, time) {
		const redisSet = promisfy(this.client.set).bind(this.client);
		await redisSet(key, value);
		await this.client.expire(key, time);
	}

	async del(key) {
		const redisDel = promisfy(this.client.del).bind(this.client);
		await redisDel(key);
	}
}

const redisClient = new RedisClient();

module.exports = redisClient;