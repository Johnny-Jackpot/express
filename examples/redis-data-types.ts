import dotenv from 'dotenv';
import {createClient} from 'redis';

dotenv.config();

const redisUrl = process.env["REDIS_URL"] || "redis://localhost:6379";
const redis = createClient({url: redisUrl});

async function run() {
  await redis.connect();
  console.log("Connected to Redis");
  console.log("ping", await redis.ping());

  await runRedisStringExample();
  await runRedisHashExample();
  await runRedisListExample();
  await runRedisSetExample();
  await runTtlExample();

  await redis.quit();
}

run().catch((error) => {
  console.error("Error connecting to Redis:", error);
  process.exit(1);
});

async function runRedisStringExample() {
  console.log('==== Running Redis string example ====')

  const stringKey = "demo:page_views";
  await redis.set(stringKey, "100");
  const pageViews = await redis.get(stringKey);
  console.log("pageViews", pageViews);

  const afterInc = await redis.incr(stringKey);
  console.log("afterInc", afterInc);
}

async function runRedisHashExample() {
  console.log('==== Running Redis hash example ====')

  const hashKey = "demo:user:profile";
  await redis.hSet(hashKey, {
    name: 'John',
    email: 'john@example.com',
  })

  const userProfile = await redis.hGetAll(hashKey);
  console.log("userProfile", userProfile);
  const userEmail = await redis.hGet(hashKey, 'email');
  console.log("userEmail", userEmail);
}

async function runRedisListExample() {
  console.log('==== Running Redis list example ====')

  const listKey = "demo:messages"
  await redis.lPush(listKey, "message 1");
  await redis.lPush(listKey, "message 2");
  await redis.lPush(listKey, "message 3");

  const messages = await redis.lRange(listKey, 0, 2);
  console.log("messages", messages);

  const productsKey = "demo:products";
  await redis.rPush(productsKey, "product 1");
  await redis.rPush(productsKey, "product 2");
  await redis.rPush(productsKey, "product 3");
  const products = await redis.lRange(productsKey, 0, 2);
  console.log("products", products);
}

//unique values only
async function runRedisSetExample() {
  console.log('==== Running Redis set example ====')

  const setKey = "demo:tags";
  await redis.sAdd(setKey, 'tag 1');
  await redis.sAdd(setKey, 'tag 1');
  await redis.sAdd(setKey, 'tag 1');
  await redis.sAdd(setKey, 'tag 2');
  await redis.sAdd(setKey, 'tag 3');

  const tags = await redis.sMembers(setKey);
  console.log("tags", tags);
  const tagCount = await redis.sCard(setKey);
  console.log("tagCount", tagCount);

  const rankKey = "demo:leaderboard";
  await redis.zAdd(rankKey, {score: 100, value: 'user 1'});
  await redis.zAdd(rankKey, {score: 200, value: 'user 2'});

  const newScore = await redis.zIncrBy(rankKey, 10, 'user 1');
  console.log("newScore", newScore);

  const rank = await redis.zRevRank(rankKey, 'user 2');
  console.log("rank", rank);

  const leaderboard = await redis.zRangeWithScores(rankKey, 0, -1, { REV: true });
  console.log("leaderboard", leaderboard);

  const topUsers = await redis.zRange(rankKey, 0, -1, { REV: true });
  console.log("topUsers", topUsers);

  const top3 = await redis.zRangeWithScores(rankKey, 0, 2, { REV: true });
  console.log("top3", top3);

  const ascending = await redis.zRangeWithScores(rankKey, 0, -1);
  console.log("ascending", ascending);
}

async function runTtlExample() {
  console.log('==== Running Redis TTl example ====')

  const optKey = "demo:opt";
  await redis.set(optKey, "1245");
  await redis.expire(optKey, 2);
  const opt = await redis.get(optKey);
  console.log("opt", opt);
  const ttl = await redis.ttl(optKey);
  console.log("ttl", ttl);

  await sleep(2000);
  const optAfterExpire = await redis.get(optKey);
  console.log("opt", optAfterExpire);
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}