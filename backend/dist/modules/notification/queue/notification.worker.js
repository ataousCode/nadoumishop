"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationWorker = void 0;
const bullmq_1 = require("bullmq");
const queue_config_1 = require("./queue.config");
const email_provider_1 = require("../email/email.provider");
const notification_types_1 = require("../notification.types");
const notification_constants_1 = require("../notification.constants");
const emailProvider = new email_provider_1.EmailProvider();
exports.notificationWorker = new bullmq_1.Worker(notification_constants_1.NOTIFICATION_QUEUE, async (job) => {
    console.log(`Processing job ${job.id} of type ${job.name}`);
    try {
        if (job.name === notification_types_1.NotificationType.EMAIL) {
            const payload = job.data;
            await emailProvider.sendMail(payload.to, payload.subject, payload.template, payload.context);
            console.log(`Email sent successfully to ${payload.to}`);
        }
    }
    catch (error) {
        console.error(`Failed to process job ${job.id}:`, error);
        throw error;
    }
}, { connection: queue_config_1.connection });
exports.notificationWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed!`);
});
exports.notificationWorker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed with ${err.message}`);
});
//# sourceMappingURL=notification.worker.js.map