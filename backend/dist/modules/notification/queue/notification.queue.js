"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationQueueProducer = exports.notificationQueue = void 0;
const bullmq_1 = require("bullmq");
const queue_config_1 = require("./queue.config");
const notification_types_1 = require("../notification.types");
const notification_constants_1 = require("../notification.constants");
exports.notificationQueue = new bullmq_1.Queue(notification_constants_1.NOTIFICATION_QUEUE, {
    connection: queue_config_1.connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000,
        },
        removeOnComplete: true,
    },
});
class NotificationQueueProducer {
    async addEmailJob(payload) {
        await exports.notificationQueue.add(notification_types_1.NotificationType.EMAIL, payload);
        console.log(`Added email job to queue: ${payload.to}`);
    }
}
exports.NotificationQueueProducer = NotificationQueueProducer;
//# sourceMappingURL=notification.queue.js.map