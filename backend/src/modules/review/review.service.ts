import { CreateReviewDto } from "./dto/review.dto";
import { reviewRepository } from "./review.repository";
import { productService } from "../product/product.service";
import { AppError } from "../../utils/AppError";

export class ReviewService {
  async createReview(userId: string, input: CreateReviewDto) {
    // 1. Check if product exists
    await productService.getProductById(input.productId);

    // 2. Check if user already reviewed passing product
    const existingReview = await reviewRepository.findByUserAndProduct(
      userId,
      input.productId,
    );
    if (existingReview) {
      throw new AppError("You have already reviewed this product", 400);
    }

    // 3. Create Review
    return await reviewRepository.create(userId, input);
  }

  async getProductReviews(productId: string) {
    return await reviewRepository.findByProductId(productId);
  }

  async deleteReview(
    userId: string,
    reviewId: string,
    isAdmin: boolean = false,
  ) {
    const review = await reviewRepository.findById(reviewId);

    if (!review) {
      throw new AppError("Review not found", 404);
    }

    // Allow deleting if user owns review OR is admin
    if (review.userId !== userId && !isAdmin) {
      throw new AppError(
        "You do not have permission to delete this review",
        403,
      );
    }

    return await reviewRepository.delete(reviewId);
  }
}

export const reviewService = new ReviewService();
