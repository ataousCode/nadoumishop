import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import * as cartController from "./cart.controller";

import { validate } from "../../middlewares/validate.middleware";
import { AddToCartSchema, UpdateCartItemSchema } from "./dto/cart.dto";

const router = Router();

// Protect all routes
router.use(protect);

router
  .route("/")
  .get(cartController.getCart)
  .post(validate(AddToCartSchema), cartController.addToCart)
  .delete(cartController.clearCart);

router
  .route("/:id")
  .patch(validate(UpdateCartItemSchema), cartController.updateCartItem)
  .delete(cartController.removeCartItem);

export default router;
