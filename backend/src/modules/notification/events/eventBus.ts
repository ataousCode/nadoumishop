import EventEmitter from "events";
import { NotificationService } from "../notification.service";
import { EVENTS } from "./notification.events";
import logger from "../../../utils/logger";

class EventBus extends EventEmitter {}

export const eventBus = new EventBus();
const notificationService = new NotificationService();

// Event Listeners
eventBus.on(EVENTS.USER.REGISTERED, async (payload) => {
  const { email, name, otp } = payload;
  logger.info(`Event received: ${EVENTS.USER.REGISTERED}`);
  await notificationService.sendWelcomeEmail(email, name);
  await notificationService.sendOtpEmail(email, name, otp);
});

eventBus.on(EVENTS.USER.FORGOT_PASSWORD, async (payload) => {
  const { email, name, resetLink } = payload;
  logger.info(`Event received: ${EVENTS.USER.FORGOT_PASSWORD}`);
  await notificationService.sendPasswordResetEmail(email, name, resetLink);
});
