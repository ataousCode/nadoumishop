import Redis from "ioredis";
import { env } from "./env";
import { Logger } from "../utils/logger";

const redis = new Redis({
  host: env.REDIS_HOST,
  port: Number(env.REDIS_PORT),
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on("connect", () => {
  Logger.info("Redis client connected");
});

redis.on("error", (err) => {
  Logger.error("Redis client error", err);
});

export { redis };
