"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const user_dto_1 = require("./dto/user.dto");
const router = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
// Protect all routes
router.use(auth_middleware_1.protect);
router.get("/me", userController.getMe);
router.patch("/me", (0, validate_middleware_1.validate)(user_dto_1.UpdateUserSchema), userController.updateMe);
exports.default = router;
//# sourceMappingURL=user.routes.js.map