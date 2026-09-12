import {createClient} from 'redis'
import {env} from "../config/env.js";

export const redis = createClient({url: env.redisUrl})

redis
  .on('connect', () => console.log('Redis connected'))
  .on('ready', () => console.log('Redis ready'))
  .on('error', (error) => console.error('Redis error:', error))
  .on('end', () => console.log('Redis disconnected'))

export async function connectRedis() {
  if (redis.isOpen) {
    return;
  }

  await redis.connect();

  const pong = await redis.ping();

  console.log("Redis ping:", pong);
}

export async function disconnectRedis() {
  if (!redis.isOpen) {
    return;
  }

  await redis.quit();
}