"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const auth_dto_1 = require("./dto/auth.dto");
const rateLimit_middleware_1 = require("../../middlewares/rateLimit.middleware");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
router.post("/signup", rateLimit_middleware_1.authLimiter, (0, validate_middleware_1.validate)(auth_dto_1.SignupSchema), authController.signup);
router.post("/login", rateLimit_middleware_1.loginLimiter, (0, validate_middleware_1.validate)(auth_dto_1.LoginSchema), authController.login);
router.post("/verify-otp", rateLimit_middleware_1.authLimiter, (0, validate_middleware_1.validate)(auth_dto_1.VerifyOtpSchema), authController.verifyOtp);
router.post("/forgot-password", rateLimit_middleware_1.authLimiter, (0, validate_middleware_1.validate)(auth_dto_1.ForgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", rateLimit_middleware_1.authLimiter, (0, validate_middleware_1.validate)(auth_dto_1.ResetPasswordSchema), authController.resetPassword);
router.post("/refresh-token", rateLimit_middleware_1.authLimiter, authController.refreshToken); // Validation handled manually for cookies
router.post("/logout", authController.logout);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map