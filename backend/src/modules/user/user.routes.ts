import { Router } from "express";
import { UserController } from "./user.controller";
import { protect } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { UpdateUserSchema } from "./dto/user.dto";

const router = Router();
const userController = new UserController();

// Protect all routes
router.use(protect);

router.get("/me", userController.getMe);
router.patch("/me", validate(UpdateUserSchema), userController.updateMe);

export default router;
