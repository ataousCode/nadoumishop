import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { orderService } from "./order.service";
import { CreateOrderDto } from "./dto/order.dto";
import { AppError } from "../../utils/AppError";

export const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const input: CreateOrderDto = req.body;

    const order = await orderService.createOrder(userId, input);

    res.status(201).json({
      status: "success",
      data: {
        order,
      },
    });
  },
);

export const getOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const orders = await orderService.getUserOrders(userId);

    res.status(200).json({
      status: "success",
      results: orders.length,
      data: {
        orders,
      },
    });
  },
);

export const reviewOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const review = await orderService.reviewOrder(userId);

    res.status(200).json({
      status: "success",
      data: {
        review,
      },
    });
  },
);

export const getOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const orderId = req.params.id as string;

    const order = await orderService.getOrderById(userId, orderId);

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  },
);

export const updateOrderAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const orderId = req.params.id as string;
    const { addressId } = req.body;

    if (!addressId) {
      throw new AppError("addressId is required", 400);
    }

    const order = await orderService.updateOrderAddress(
      userId,
      orderId,
      addressId,
    );

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  },
);

export const cancelOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const orderId = req.params.id as string;

    const order = await orderService.cancelOrder(userId, orderId);

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  },
);

export const getAdminOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const orders = await orderService.getAllOrders();

    res.status(200).json({
      status: "success",
      results: orders.length,
      data: {
        orders,
      },
    });
  },
);
