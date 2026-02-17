import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.coerce.number().min(0, "Price must be greater than or equal to 0"),
    stock: z.coerce
      .number()
      .int()
      .min(0, "Stock must be greater than or equal to 0"),
    images: z.any().optional(),
    categoryId: z.string().uuid("Invalid category ID"),
    isNewArrival: z
      .string()
      .transform((val) => val === "true")
      .or(z.boolean())
      .optional()
      .default(false),
    isBestSeller: z
      .string()
      .transform((val) => val === "true")
      .or(z.boolean())
      .optional()
      .default(false),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>["body"];
