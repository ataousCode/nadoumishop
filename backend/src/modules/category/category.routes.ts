import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "./category.controller";

import { protect } from "../../middlewares/auth.middleware";
import { restrictTo } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createCategorySchema } from "./dto/create-category.dto";
import { updateCategorySchema } from "./dto/update-category.dto";

const router = Router();

router
  .route("/")
  .get(getAllCategories)
  .post(
    protect,
    restrictTo("ADMIN"),
    validate(createCategorySchema),
    createCategory,
  );

router
  .route("/:id")
  .get(getCategory)
  .patch(
    protect,
    restrictTo("ADMIN"),
    validate(updateCategorySchema),
    updateCategory,
  )
  .delete(protect, restrictTo("ADMIN"), deleteCategory);

export default router;
