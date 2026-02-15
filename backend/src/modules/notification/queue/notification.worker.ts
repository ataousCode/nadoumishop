import { Worker, Job } from "bullmq";
import { connection } from "./queue.config";
import { EmailProvider } from "../email/email.provider";
import { EmailPayload, NotificationType } from "../notification.types";
import { NOTIFICATION_QUEUE } from "../notification.constants";
import logger from "../../../utils/logger";

const emailProvider = new EmailProvider();

export const notificationWorker = new Worker(
  NOTIFICATION_QUEUE,
  async (job: Job) => {
    logger.info(`Processing job ${job.id} of type ${job.name}`);

    try {
      if (job.name === NotificationType.EMAIL) {
        const payload = job.data as EmailPayload;
        await emailProvider.sendMail(
          payload.to,
          payload.subject,
          payload.template,
          payload.context,
        );
        logger.info(`Email sent successfully to ${payload.to}`);
      }
    } catch (error) {
      logger.error(`Failed to process job ${job.id}:`, error);
      throw error;
    }
  },
  { connection },
);

notificationWorker.on("completed", (job) => {
  logger.info(`Job ${job.id} completed!`);
});

notificationWorker.on("failed", (job, err) => {
  logger.error(`Job ${job?.id} failed with ${err.message}`);
});
