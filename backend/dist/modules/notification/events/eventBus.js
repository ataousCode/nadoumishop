"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventBus = void 0;
const events_1 = __importDefault(require("events"));
const notification_service_1 = require("../notification.service");
const notification_events_1 = require("./notification.events");
class EventBus extends events_1.default {
}
exports.eventBus = new EventBus();
const notificationService = new notification_service_1.NotificationService();
// Event Listeners
exports.eventBus.on(notification_events_1.EVENTS.USER.REGISTERED, async (payload) => {
    const { email, name, otp } = payload;
    console.log(`Event received: ${notification_events_1.EVENTS.USER.REGISTERED}`);
    await notificationService.sendWelcomeEmail(email, name);
    await notificationService.sendOtpEmail(email, name, otp);
});
exports.eventBus.on(notification_events_1.EVENTS.USER.FORGOT_PASSWORD, async (payload) => {
    const { email, name, resetLink } = payload;
    console.log(`Event received: ${notification_events_1.EVENTS.USER.FORGOT_PASSWORD}`);
    await notificationService.sendPasswordResetEmail(email, name, resetLink);
});
//# sourceMappingURL=eventBus.js.map