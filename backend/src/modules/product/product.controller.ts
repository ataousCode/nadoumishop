import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { productService } from "./product.service";

export const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await productService.createProduct(req.body);

    res.status(201).json({
      status: "success",
      data: {
        product,
      },
    });
  },
);

export const getAllProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as any;
    const result = await productService.getAllProducts(query);

    res.status(200).json({
      status: "success",
      results: result.products.length,
      data: result,
    });
  },
);

export const getProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await productService.getProductById(
      req.params.id as string,
    );

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  },
);

export const updateProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await productService.updateProduct(
      req.params.id as string,
      req.body,
    );

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  },
);

export const deleteProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await productService.deleteProduct(req.params.id as string);

    res.status(204).json({
      status: "success",
      data: null,
    });
  },
);
