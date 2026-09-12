import {redis} from "../lib/redis.js";
import {logger} from "../lib/logger.js";

type CacheOptions<T> = {
  cacheKey: string,
  fetch: () => Promise<T>,
  ttl: number,
  negativeTtl?: number,
}

const DEFAULT_NEGATIVE_TTL = 60; // 1 minute

export async function getFromCacheOrFetch<T>(
  {cacheKey, fetch, ttl, negativeTtl = DEFAULT_NEGATIVE_TTL}: CacheOptions<T>
): Promise<T> {
  const cachedData = await redis.get(cacheKey);
  if (cachedData !== null) {
    const parsed = JSON.parse(cachedData) as T;
    logger.info(
      `cache ${parsed === null || parsed === undefined ? 'negative hit' : 'hit'}: "${cacheKey}"`
    );
    return parsed;
  }

  logger.info(`cache miss: "${cacheKey}"`);

  const data = await fetch();
  if (data === null || data === undefined) {
    logger.info(`cache negative set: "${cacheKey}" (ttl=${negativeTtl}s)`);
  }

  const effectiveTtl = data === null || data === undefined ? negativeTtl : ttl;
  await redis.setEx(cacheKey, effectiveTtl, JSON.stringify(data));

  return data as T;
}

export async function invalidateCache(cacheKey: string | string[]): Promise<void> {
  if (Array.isArray(cacheKey) && cacheKey.length === 0) {
    return;
  }
  await redis.del(cacheKey);
}