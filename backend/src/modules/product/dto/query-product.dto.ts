import { z } from "zod";

export const queryProductSchema = z.object({
  query: z.object({
    category: z.string().optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

export type QueryProductInput = z.infer<typeof queryProductSchema>["query"];
