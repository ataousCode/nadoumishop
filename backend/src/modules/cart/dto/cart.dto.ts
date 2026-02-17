import { z } from "zod";

export const AddToCartSchema = z.object({
  body: z.object({
    productId: z.string().uuid("Invalid Product ID"),
    quantity: z.number().int().positive("Quantity must be a positive integer"),
  }),
});

export const UpdateCartItemSchema = z.object({
  body: z.object({
    quantity: z.number().int().positive("Quantity must be a positive integer"),
  }),
});

export type AddToCartDto = z.infer<typeof AddToCartSchema>["body"];
export type UpdateCartItemDto = z.infer<typeof UpdateCartItemSchema>["body"];
