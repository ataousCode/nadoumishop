import { z } from "zod";

export const UpdateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
  }),
});

export const UpdatePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
  }),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>["body"];
export type UpdatePasswordDto = z.infer<typeof UpdatePasswordSchema>["body"];
