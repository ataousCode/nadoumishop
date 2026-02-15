import { z } from "zod";

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    price: z.number().min(0).optional(),
    stock: z.number().int().min(0).optional(),
    images: z.array(z.string().url()).min(1).optional(),
    categoryId: z.string().uuid().optional(),
  }),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>["body"];
