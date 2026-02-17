import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { productService } from "./product.service";

export const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("createProduct: Request body:", req.body);
      console.log("createProduct: Request files:", req.files);

      // Handle image uploads
      const files = req.files as Express.Multer.File[];
      const images =
        files?.map((file) => `/images/products/${file.filename}`) || [];

      // Explicitly pick fields to avoid Prisma errors if extra fields are present in req.body
      const productData = {
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        stock: Number(req.body.stock),
        discount: Number(req.body.discount) || 0, // Add discount
        categoryId: req.body.categoryId,
        images,
        isNewArrival:
          req.body.isNewArrival === "true" || req.body.isNewArrival === true,
        isBestSeller:
          req.body.isBestSeller === "true" || req.body.isBestSeller === true,
      };

      if (!productData.categoryId || productData.categoryId.trim() === "") {
        console.error("createProduct: Empty categoryId received");
        // Let it fall through to service, or throw explicit error
        // But validation should have caught this?
      }

      const product = await productService.createProduct(productData);

      res.status(201).json({
        status: "success",
        data: {
          product,
        },
      });
    } catch (error) {
      console.error("createProduct: CRITICAL ERROR:", error);
      next(error);
    }
  },
);

import { queryProductSchema } from "./dto/query-product.dto";

export const getAllProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Parse and transform query parameters using the Zod schema
    // We wrap req.query in an object to match the schema structure { query: ... }
    const parsed = queryProductSchema.safeParse({ query: req.query });

    if (!parsed.success) {
      // Optional: return 400 if validation fails, or just log and use defaults.
      // For now, let's return 400 to aid debugging.
      return next(new Error("Invalid query parameters"));
    }

    const result = await productService.getAllProducts(parsed.data.query);

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
    // Handle image uploads if any
    const files = req.files as Express.Multer.File[];

    // Create an update object with allowed fields
    const updateData: any = {};
    const allowedFields = [
      "name",
      "description",
      "price",
      "stock",
      "discount",
      "categoryId",
      "isNewArrival",
      "isBestSeller",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "price" || field === "stock" || field === "discount") {
          updateData[field] = Number(req.body[field]);
        } else if (field === "isNewArrival" || field === "isBestSeller") {
          updateData[field] =
            req.body[field] === "true" || req.body[field] === true;
        } else {
          updateData[field] = req.body[field];
        }
      }
    });

    if (files && files.length > 0) {
      const newImages = files.map(
        (file) => `/images/products/${file.filename}`,
      );
      // For updates, we might want to append or replace.
      // Simple implementation: replace if new images provided, or manage carefully.
      // For now, let's assume replacement if the field is present,
      // but usually enterprise needs "add" or "delete specific".
      updateData.images = newImages;
    }

    const product = await productService.updateProduct(
      req.params.id as string,
      updateData,
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
