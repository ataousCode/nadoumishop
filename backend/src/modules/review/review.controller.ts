import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reviewService } from "./review.service";
import { CreateReviewDto } from "./dto/review.dto";

export const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const input: CreateReviewDto = req.body;

    const review = await reviewService.createReview(userId, input);

    res.status(201).json({
      status: "success",
      data: {
        review,
      },
    });
  },
);

export const getReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.productId as string;
    const reviews = await reviewService.getProductReviews(productId);

    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: {
        reviews,
      },
    });
  },
);

export const deleteReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const reviewId = req.params.id as string;
    const isAdmin = req.user!.role === "ADMIN";

    await reviewService.deleteReview(userId, reviewId, isAdmin);

    res.status(204).json({
      status: "success",
      data: null,
    });
  },
);
