import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import * as reviewController from "./review.controller";
import { CreateReviewSchema } from "./dto/review.dto";

const router = Router();

// Public route to get reviews for a product
router.get("/product/:productId", reviewController.getReview);

// Protected routes
router.use(protect);

router.post("/", validate(CreateReviewSchema), reviewController.createReview);
router.delete("/:id", reviewController.deleteReview);

export default router;
