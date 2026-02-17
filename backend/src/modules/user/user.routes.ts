import { Router } from "express";
import { UserController } from "./user.controller";
import { protect } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { UpdateUserSchema, UpdatePasswordSchema } from "./dto/user.dto";

import { restrictTo } from "../../middlewares/role.middleware";

import { upload } from "../../middlewares/upload.middleware";

const router = Router();
const userController = new UserController();

// Protect all routes
router.use(protect);

router.get("/me", userController.getMe);
router.patch(
  "/me",
  upload.single("profilePicture"),
  validate(UpdateUserSchema),
  userController.updateMe,
);
router.patch(
  "/change-password",
  validate(UpdatePasswordSchema),
  userController.updatePassword,
);

// Admin only routes
router.use(restrictTo("ADMIN"));
router.get("/", restrictTo("ADMIN"), userController.getAllUsers);
router.post("/", restrictTo("ADMIN"), userController.createUser);
router.patch("/:id", restrictTo("ADMIN"), userController.updateUser);
router.patch(
  "/:id/block",
  restrictTo("ADMIN"),
  userController.toggleBlockStatus,
);
router.delete("/:id", restrictTo("ADMIN"), userController.deleteUser);

export default router;
