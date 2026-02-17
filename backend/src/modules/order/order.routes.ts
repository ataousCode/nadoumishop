import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import * as orderController from "./order.controller";

import { validate } from "../../middlewares/validate.middleware";
import { CreateOrderSchema } from "./dto/order.dto";

import { restrictTo } from "../../middlewares/role.middleware";

const router = Router();

// Protect all routes
router.use(protect);

router.get("/admin", restrictTo("ADMIN"), orderController.getAdminOrders);

router
  .route("/")
  .get(orderController.getOrders)
  .post(validate(CreateOrderSchema), orderController.createOrder);

router.get("/preview", orderController.reviewOrder);

router.route("/:id").get(orderController.getOrder);
router.patch("/:id/cancel", orderController.cancelOrder);
router.patch("/:id/address", orderController.updateOrderAddress);

export default router;
