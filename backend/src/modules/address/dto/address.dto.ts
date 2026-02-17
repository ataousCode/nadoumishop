import { z } from "zod";

export const CreateAddressSchema = z.object({
  body: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(1, "Zip code is required"),
    country: z.string().min(1, "Country is required"),
    isDefault: z.boolean().optional(),
  }),
});

export const UpdateAddressSchema = z.object({
  body: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
    isDefault: z.boolean().optional(),
  }),
});

export type CreateAddressDto = z.infer<typeof CreateAddressSchema>["body"];
export type UpdateAddressDto = z.infer<typeof UpdateAddressSchema>["body"];
