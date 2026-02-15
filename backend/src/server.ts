import "dotenv/config"; // Load env vars first
import { env } from "./config/env";
import app from "./app";
import { prisma } from "./config/prisma";
import logger from "./utils/logger";
import "./modules/notification/events/eventBus"; // Initialize Event Bus
import "./modules/notification/queue/notification.worker"; // Start Notification Worker

// Handle Uncaught Exceptions
process.on("uncaughtException", (err: Error) => {
  logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  logger.error(err.name, err.message);
  process.exit(1);
});

const port = env.PORT || 5001;

const server = app.listen(port, () => {
  logger.info(`App running on port ${port} in ${env.NODE_ENV} mode`);
  logger.info(`Documentation available at http://localhost:${port}/api-docs`);
});

// Handle Unhandled Rejections
process.on("unhandledRejection", (err: Error) => {
  logger.error("UNHANDLED REJECTION! 💥 Shutting down...");
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on("SIGTERM", () => {
  logger.info("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    logger.info("💥 Process terminated!");
  });
});
