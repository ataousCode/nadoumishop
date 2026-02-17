import { z } from "zod";

export const notificationTypeSchema = z.enum([
  "ORDER",
  "PAYMENT",
  "CANCELATION",
  "SYSTEM",
]);

export const createNotificationSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    message: z.string().min(1, "Message is required"),
    type: notificationTypeSchema.default("SYSTEM"),
    userId: z.string().uuid().optional(),
  }),
});

export type CreateNotificationInput = z.infer<
  typeof createNotificationSchema
>["body"];
