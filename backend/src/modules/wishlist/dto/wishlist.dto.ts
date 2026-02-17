import { z } from "zod";

export const AddToWishlistSchema = z.object({
  body: z.object({
    productId: z.string().uuid("Invalid Product ID"),
  }),
});

export type AddToWishlistDto = z.infer<typeof AddToWishlistSchema>["body"];
