import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "./product.controller";

import { validate } from "../../middlewares/validate.middleware";
import { createProductSchema } from "./dto/create-product.dto";
import { updateProductSchema } from "./dto/update-product.dto";
import { queryProductSchema } from "./dto/query-product.dto";

import { protect } from "../../middlewares/auth.middleware";
import { restrictTo } from "../../middlewares/role.middleware";
import { upload } from "../../middlewares/upload.middleware";

const router = Router();

router
  .route("/")
  .get(validate(queryProductSchema), getAllProducts)
  .post(
    protect,
    restrictTo("ADMIN"),
    upload.array("images", 6),
    validate(createProductSchema),
    createProduct,
  );

router
  .route("/:id")
  .get(getProduct)
  .patch(
    protect,
    restrictTo("ADMIN"),
    upload.array("images", 6),
    validate(updateProductSchema),
    updateProduct,
  )
  .delete(protect, restrictTo("ADMIN"), deleteProduct);

export default router;
