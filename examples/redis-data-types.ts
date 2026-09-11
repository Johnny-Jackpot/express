import dotenv from 'dotenv';
import {createClient} from 'redis';

dotenv.config();

const redisUrl = process.env["REDIS_URL"] || "redis://localhost:6379";
const redis = createClient({url: redisUrl});

async function run() {
  await redis.connect();
  console.log("Connected to Redis");
  console.log("ping", await redis.ping());
}

run().catch((error) => {
  console.error("Error connecting to Redis:", error);
  process.exit(1);
});