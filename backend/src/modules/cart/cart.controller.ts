import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { cartService } from "./cart.service";
import { AddToCartDto, UpdateCartItemDto } from "./dto/cart.dto";

export const getCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const cart = await cartService.getCart(userId);

    res.status(200).json({
      status: "success",
      data: {
        cart,
      },
    });
  },
);

export const addToCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const input: AddToCartDto = req.body;

    await cartService.addItemToCart(userId, input);
    const cart = await cartService.getCart(userId);

    res.status(200).json({
      status: "success",
      data: {
        cart,
      },
    });
  },
);

export const updateCartItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const cartItemId = req.params.id as string;
    const input: UpdateCartItemDto = req.body;

    await cartService.updateItemQuantity(userId, cartItemId, input);
    const cart = await cartService.getCart(userId);

    res.status(200).json({
      status: "success",
      data: {
        cart,
      },
    });
  },
);

export const removeCartItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const cartItemId = req.params.id as string;

    await cartService.removeItemFromCart(userId, cartItemId);
    const cart = await cartService.getCart(userId);

    res.status(200).json({
      status: "success",
      data: {
        cart,
      },
    });
  },
);

export const clearCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;

    await cartService.clearCart(userId);

    res.status(204).json({
      status: "success",
      data: null,
    });
  },
);
