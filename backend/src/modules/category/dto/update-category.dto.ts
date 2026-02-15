import { z } from "zod";

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Category name is required").optional(),
  }),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>["body"];
