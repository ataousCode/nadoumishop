import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be greater than or equal to 0"),
    stock: z.number().int().min(0, "Stock must be greater than or equal to 0"),
    images: z.array(z.string().url()).min(1, "At least one image is required"),
    categoryId: z.string().uuid("Invalid category ID"),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>["body"];
