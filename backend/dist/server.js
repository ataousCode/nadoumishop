"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config"); // Load env vars first
const env_1 = require("./config/env");
const app_1 = __importDefault(require("./app"));
const logger_1 = require("./utils/logger");
require("./modules/notification/events/eventBus"); // Initialize Event Bus
require("./modules/notification/queue/notification.worker"); // Start Notification Worker
// Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
    logger_1.Logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    logger_1.Logger.error(err.name, err.message);
    process.exit(1);
});
const port = env_1.env.PORT || 5001;
const server = app_1.default.listen(port, () => {
    logger_1.Logger.info(`App running on port ${port} in ${env_1.env.NODE_ENV} mode`);
    logger_1.Logger.info(`Documentation available at http://localhost:${port}/api-docs`);
});
// Handle Unhandled Rejections
process.on("unhandledRejection", (err) => {
    logger_1.Logger.error("UNHANDLED REJECTION! 💥 Shutting down...");
    logger_1.Logger.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
// Handle SIGTERM
process.on("SIGTERM", () => {
    logger_1.Logger.info("👋 SIGTERM RECEIVED. Shutting down gracefully");
    server.close(() => {
        logger_1.Logger.info("💥 Process terminated!");
    });
});
//# sourceMappingURL=server.js.map