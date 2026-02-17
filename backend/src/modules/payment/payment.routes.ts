import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import * as paymentController from "./payment.controller";

const router = Router();

// Protect all routes
router.use(protect);

router.get("/methods", paymentController.getPaymentMethods);

export default router;
