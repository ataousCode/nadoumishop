import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";

export const getPaymentMethods = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const methods = paymentService.getSupportedMethods();

    res.status(200).json({
      status: "success",
      data: {
        methods,
      },
    });
  },
);
