import { z } from "zod";

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    price: z.coerce.number().min(0).optional(),
    stock: z.coerce.number().int().min(0).optional(),
    images: z.array(z.string()).optional(),
    categoryId: z.string().uuid().optional(),
    isNewArrival: z
      .string()
      .transform((val) => val === "true")
      .or(z.boolean())
      .optional(),
    isBestSeller: z
      .string()
      .transform((val) => val === "true")
      .or(z.boolean())
      .optional(),
  }),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>["body"];
