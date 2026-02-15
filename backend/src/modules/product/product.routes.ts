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

const router = Router();

router
  .route("/")
  .get(validate(queryProductSchema), getAllProducts)
  .post(validate(createProductSchema), createProduct);

router
  .route("/:id")
  .get(getProduct)
  .patch(validate(updateProductSchema), updateProduct)
  .delete(deleteProduct);

export default router;
