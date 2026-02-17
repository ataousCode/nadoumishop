import { PaymentStatus } from "@prisma/client";

export interface PaymentResult {
  status: PaymentStatus;
  transactionId?: string;
  details?: any;
}

export interface PaymentProvider {
  processPayment(
    orderId: string,
    amount: number,
    details?: any,
  ): Promise<PaymentResult>;
  refundPayment?(transactionId: string, amount: number): Promise<boolean>;
}
