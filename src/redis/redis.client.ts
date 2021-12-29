import * as redis from 'redis';
import logger from '../logger';

const redisClient = redis.createClient();

redisClient.on('error', (err) => {
  logger.error(`RedisError ${err}`);
});
redisClient.on('end', () => logger.info('RedisEnd'));

redisClient.connect();

export default redisClient;