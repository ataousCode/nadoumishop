import { NotificationQueueProducer } from "./queue/notification.queue";
import { EmailPayload } from "./notification.types";

const notificationQueueProducer = new NotificationQueueProducer();

export class NotificationService {
  async sendEmail(payload: EmailPayload) {
    await notificationQueueProducer.addEmailJob(payload);
  }

  async sendWelcomeEmail(to: string, name: string) {
    await this.sendEmail({
      to,
      subject: "Welcome to Nadoumi Shop!",
      template: "welcome",
      context: { name, year: new Date().getFullYear() },
    });
  }

  async sendOtpEmail(to: string, name: string, otp: string) {
    await this.sendEmail({
      to,
      subject: "Verify Your Account",
      template: "otp-verification",
      context: { name, otp, year: new Date().getFullYear() },
    });
  }

  async sendPasswordResetEmail(to: string, name: string, resetLink: string) {
    await this.sendEmail({
      to,
      subject: "Reset Your Password",
      template: "reset-password",
      context: { name, resetUrl: resetLink, year: new Date().getFullYear() },
    });
  }
}
