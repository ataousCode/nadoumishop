import { z } from "zod";

export const CreateReviewSchema = z.object({
  body: z.object({
    productId: z.string().uuid("Invalid Product ID"),
    rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
    comment: z.string().optional(),
  }),
});

export type CreateReviewDto = z.infer<typeof CreateReviewSchema>["body"];
