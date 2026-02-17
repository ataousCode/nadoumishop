import { Request, Response } from "express";
import { wishlistService } from "./wishlist.service";
import { catchAsync } from "../../utils/catchAsync";

export const getWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const wishlist = await wishlistService.getWishlist(userId);

  res.status(200).json({
    status: "success",
    data: {
      wishlist,
    },
  });
});

export const addToWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { productId } = req.body;

  const wishlist = await wishlistService.addToWishlist(userId, productId);

  res.status(200).json({
    status: "success",
    data: {
      wishlist,
    },
  });
});

export const removeFromWishlist = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const productId = req.params.productId as string;

    const wishlist = await wishlistService.removeFromWishlist(
      userId,
      productId,
    );

    res.status(200).json({
      status: "success",
      data: {
        wishlist,
      },
    });
  },
);
