import redis from 'redis';

const { REDIS_URL } = process.env;

const client = redis.createClient({
  url: REDIS_URL,
});

export default client;