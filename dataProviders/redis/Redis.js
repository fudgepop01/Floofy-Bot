const bluebird = require('bluebird');
const redisClient = require('redis');
const logger = require('../../structures/Logger.js');

bluebird.promisifyAll(redisClient.RedisClient.prototype);
bluebird.promisifyAll(redisClient.Multi.prototype);

class Redis {
	constructor() {
		this.redis = redisClient.createClient({ db: 2 });
	}

	get db() {
		return this.redis;
	}

	start() {
		this.redis.on('error', err => { logger.error(err); })
			.on('reconnecting', () => { logger.warn('Reconnecting...'); });
	}
}

module.exports = Redis;
