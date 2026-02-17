import { NotificationRepository } from "./notification.repository";
import { CreateNotificationInput } from "./dto/notification.dto";

const notificationRepository = new NotificationRepository();

export class NotificationService {
  async createNotification(data: CreateNotificationInput) {
    return await notificationRepository.create(data);
  }

  async getMyNotifications(userId: string) {
    return await notificationRepository.findByUser(userId);
  }

  async getUnreadCount(userId: string) {
    const unread = await notificationRepository.findUnreadByUser(userId);
    return unread.length;
  }

  async markAsRead(id: string) {
    return await notificationRepository.markAsRead(id);
  }

  async deleteNotification(id: string) {
    return await notificationRepository.delete(id);
  }
}

export const notificationService = new NotificationService();
