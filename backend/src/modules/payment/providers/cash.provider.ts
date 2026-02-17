import { PaymentStatus } from "@prisma/client";
import {
  PaymentProvider,
  PaymentResult,
} from "../interfaces/payment.interface";

export class CashProvider implements PaymentProvider {
  async processPayment(
    orderId: string,
    amount: number,
    details?: any,
  ): Promise<PaymentResult> {
    // For COD, the payment is technically "PENDING" until delivery.
    // We don't interacting with an external gateway here.
    return {
      status: PaymentStatus.PENDING,
      details: {
        method: "COD",
        note: "Payment to be collected on delivery",
      },
    };
  }
}
