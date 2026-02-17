import { prisma } from "../../config/prisma";
import { CreateReviewDto } from "./dto/review.dto";

export class ReviewRepository {
  async create(userId: string, data: CreateReviewDto) {
    return prisma.review.create({
      data: {
        userId,
        productId: data.productId,
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findByProductId(productId: string) {
    return prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return prisma.review.findUnique({
      where: { id },
    });
  }

  async delete(id: string) {
    return prisma.review.delete({
      where: { id },
    });
  }

  // Check if user already reviewed this product
  async findByUserAndProduct(userId: string, productId: string) {
    return prisma.review.findFirst({
      where: {
        userId,
        productId,
      },
    });
  }
}

export const reviewRepository = new ReviewRepository();
