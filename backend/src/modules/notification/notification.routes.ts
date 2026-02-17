import { Router } from "express";
import {
  getMyNotifications,
  markAsRead,
  deleteNotification,
} from "./notification.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.use(protect);

router.get("/", getMyNotifications);
router.patch("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

export default router;
