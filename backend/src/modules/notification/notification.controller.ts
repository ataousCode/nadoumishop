import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { notificationService } from "./notification.service";

export const getMyNotifications = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const notifications = await notificationService.getMyNotifications(
      req.user!.id,
    );
    const unreadCount = await notificationService.getUnreadCount(req.user!.id);

    res.status(200).json({
      status: "success",
      data: {
        notifications,
        unreadCount,
      },
    });
  },
);

export const markAsRead = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await notificationService.markAsRead(req.params.id as string);

    res.status(200).json({
      status: "success",
      data: null,
    });
  },
);

export const deleteNotification = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await notificationService.deleteNotification(req.params.id as string);

    res.status(204).json({
      status: "success",
      data: null,
    });
  },
);
