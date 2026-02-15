import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, "../../.env") });

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("5000"),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.string().default("6379"),
  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.string().optional(),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  APP_NAME: z.string().default("Nadoumi Shop"),
  EMAIL_FROM: z.string().email().default("noreply@nadoumishop.com"),
  JWT_ACCESS_EXPIRATION: z.string().default("15m"),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
});

const _env = envSchema.safeParse(process.env);

import logger from "../utils/logger";

if (!_env.success) {
  logger.error("Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
