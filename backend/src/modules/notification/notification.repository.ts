import { PrismaClient } from "@prisma/client";
import { CreateNotificationInput } from "./dto/notification.dto";

const prisma = new PrismaClient();

export class NotificationRepository {
  async create(data: CreateNotificationInput) {
    return await prisma.notification.create({
      data,
    });
  }

  async findByUser(userId: string) {
    return await prisma.notification.findMany({
      where: {
        OR: [
          { userId },
          { userId: null }, // Broadcast to all
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findUnreadByUser(userId: string) {
    return await prisma.notification.findMany({
      where: {
        isRead: false,
        OR: [{ userId }, { userId: null }],
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async markAsRead(id: string) {
    return await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async delete(id: string) {
    return await prisma.notification.delete({
      where: { id },
    });
  }
}
