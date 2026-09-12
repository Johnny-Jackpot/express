import {redis} from "../lib/redis.js";
import {logger} from "../lib/logger.js";

type CacheOptions<T> = {
  cacheKey: string,
  fetch: () => Promise<T>,
  ttl: number
}

export async function getFromCacheOrFetch<T>({cacheKey, fetch, ttl}: CacheOptions<T>): Promise<T> {
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    logger.info(`cache hit: "${cacheKey}"`);
    return JSON.parse(cachedData) as T;
  }

  logger.info(`cache miss: "${cacheKey}"`);

  const data = await fetch();
  await redis.setEx(cacheKey, ttl, JSON.stringify(data));

  return data as T;
}

export async function invalidateCache(cacheKey: string): Promise<void> {
  await redis.del(cacheKey);
}