import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { categoryService } from "./category.service";
import { createCategorySchema } from "./dto/create-category.dto";
import { updateCategorySchema } from "./dto/update-category.dto";

export const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = createCategorySchema.parse(req.body);
    const category = await categoryService.createCategory(result.body);

    res.status(201).json({
      status: "success",
      data: {
        category,
      },
    });
  },
);

export const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await categoryService.getAllCategories();

    res.status(200).json({
      status: "success",
      results: categories.length,
      data: {
        categories,
      },
    });
  },
);

export const getCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await categoryService.getCategoryById(
      req.params.id as string,
    );

    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  },
);

export const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = updateCategorySchema.parse(req.body);
    const category = await categoryService.updateCategory(
      req.params.id as string,
      result.body,
    );

    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  },
);

export const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await categoryService.deleteCategory(req.params.id as string);

    res.status(204).json({
      status: "success",
      data: null,
    });
  },
);
