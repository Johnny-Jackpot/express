import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import {connectRedis, disconnectRedis} from "./lib/redis.js";

async function startServer() {
  try {
    await connectRedis();

    const app = createApp();

    app.listen(env.port, () => {
      logger.info(`Server is running on http://localhost:${env.port}`);
    });
  } catch (e) {
    console.error("Failed to start the server: ", e)
    process.exit(1)
  }
}

process.on("SIGINT", async () => {
  await disconnectRedis();
  process.exit(0);
})

startServer();
