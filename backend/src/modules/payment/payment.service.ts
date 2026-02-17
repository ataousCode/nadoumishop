import { AppError } from "../../utils/AppError";
import { PaymentProvider, PaymentResult } from "./interfaces/payment.interface";
import { CashProvider } from "./providers/cash.provider";

class PaymentService {
  private providers: Map<string, PaymentProvider> = new Map();

  constructor() {
    this.registerProvider("COD", new CashProvider());
    // Future providers (Stripe, PayPal) can be registered here
  }

  registerProvider(name: string, provider: PaymentProvider) {
    this.providers.set(name, provider);
  }

  async processPayment(
    method: string,
    orderId: string,
    amount: number,
    details?: any,
  ): Promise<PaymentResult> {
    const provider = this.providers.get(method);

    if (!provider) {
      throw new AppError(`Payment method ${method} not supported`, 400);
    }

    const result = await provider.processPayment(orderId, amount, details);

    // Trigger Notification (This would usually be based on result.status from stripes etc, but for COD it's success)
    // We assume the caller handles the userId for now or we fetch it.
    // In true enterprise, we'd have a userId in the payment result or fetch order.

    return result;
  }

  getSupportedMethods() {
    return Array.from(this.providers.keys());
  }
}

export const paymentService = new PaymentService();
