"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
const redis = new ioredis_1.default({
    host: env_1.env.REDIS_HOST,
    port: Number(env_1.env.REDIS_PORT),
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});
exports.redis = redis;
redis.on("connect", () => {
    logger_1.Logger.info("Redis client connected");
});
redis.on("error", (err) => {
    logger_1.Logger.error("Redis client error", err);
});
//# sourceMappingURL=redis.js.map