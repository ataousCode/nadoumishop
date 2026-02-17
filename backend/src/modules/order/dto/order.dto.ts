import { z } from "zod";

export const CreateOrderSchema = z.object({
  body: z.object({
    addressId: z.string().uuid("Invalid Address ID"),
    paymentMethod: z.enum(["COD"], {
      message: "Only Cash on Delivery (COD) is supported",
    }),
  }),
});

export type CreateOrderDto = z.infer<typeof CreateOrderSchema>["body"];
