import { Queue } from "bullmq";
import { connection } from "./queue.config";
import { EmailPayload, NotificationType } from "../notification.types";
import { NOTIFICATION_QUEUE } from "../notification.constants";
import logger from "../../../utils/logger";

export const notificationQueue = new Queue(NOTIFICATION_QUEUE, {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: true,
  },
});

export class NotificationQueueProducer {
  async addEmailJob(payload: EmailPayload) {
    await notificationQueue.add(NotificationType.EMAIL, payload);
    logger.info(`Added email job to queue: ${payload.to}`);
  }
}
