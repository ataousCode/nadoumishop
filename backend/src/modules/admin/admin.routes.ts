import { Router } from "express";
import { AdminController } from "./admin.controller";
import { protect } from "../../middlewares/auth.middleware";
import { restrictTo } from "../../middlewares/role.middleware";

const router = Router();
const adminController = new AdminController();

router.use(protect);
router.use(restrictTo("ADMIN"));

router.get("/stats", adminController.getDashboardStats);

export default router;
