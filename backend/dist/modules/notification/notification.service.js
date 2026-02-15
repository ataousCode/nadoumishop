"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const notification_queue_1 = require("./queue/notification.queue");
const notificationQueueProducer = new notification_queue_1.NotificationQueueProducer();
class NotificationService {
    async sendEmail(payload) {
        await notificationQueueProducer.addEmailJob(payload);
    }
    async sendWelcomeEmail(to, name) {
        await this.sendEmail({
            to,
            subject: "Welcome to Nadoumi Shop!",
            template: "welcome",
            context: { name, year: new Date().getFullYear() },
        });
    }
    async sendOtpEmail(to, name, otp) {
        await this.sendEmail({
            to,
            subject: "Verify Your Account",
            template: "otp-verification",
            context: { name, otp, year: new Date().getFullYear() },
        });
    }
    async sendPasswordResetEmail(to, name, resetLink) {
        await this.sendEmail({
            to,
            subject: "Reset Your Password",
            template: "reset-password",
            context: { name, resetUrl: resetLink, year: new Date().getFullYear() },
        });
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map