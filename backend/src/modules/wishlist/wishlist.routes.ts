import { Router } from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "./wishlist.controller";
import { protect } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { AddToWishlistSchema } from "./dto/wishlist.dto";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(getWishlist)
  .post(validate(AddToWishlistSchema), addToWishlist);

router.route("/:productId").delete(removeFromWishlist);

export default router;
