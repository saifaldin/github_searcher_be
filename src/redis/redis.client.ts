import * as redis from 'redis';
import logger from '../logger';

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err: any) => {
  logger.error(`RedisError ${err} ${process.env.REDIS_URL}`);
});
redisClient.on('end', () => logger.info('RedisEnd'));

redisClient.connect();

export default redisClient;