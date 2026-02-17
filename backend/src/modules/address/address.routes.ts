import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import * as addressController from "./address.controller";

import { validate } from "../../middlewares/validate.middleware";
import { CreateAddressSchema, UpdateAddressSchema } from "./dto/address.dto";

const router = Router();

// Protect all routes
router.use(protect);

router
  .route("/")
  .get(addressController.getAddresses)
  .post(validate(CreateAddressSchema), addressController.createAddress);

router
  .route("/:id")
  .get(addressController.getAddress)
  .patch(validate(UpdateAddressSchema), addressController.updateAddress)
  .delete(addressController.deleteAddress);

export default router;
