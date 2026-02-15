import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  SignupSchema,
  LoginSchema,
  VerifyOtpSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  RefreshTokenSchema,
} from "./dto/auth.dto";
import {
  authLimiter,
  loginLimiter,
} from "../../middlewares/rateLimit.middleware";

const router = Router();
const authController = new AuthController();

router.post(
  "/signup",
  authLimiter,
  validate(SignupSchema),
  authController.signup,
);
router.post(
  "/login",
  loginLimiter,
  validate(LoginSchema),
  authController.login,
);
router.post(
  "/verify-otp",
  authLimiter,
  validate(VerifyOtpSchema),
  authController.verifyOtp,
);
router.post(
  "/forgot-password",
  authLimiter,
  validate(ForgotPasswordSchema),
  authController.forgotPassword,
);
router.post(
  "/reset-password",
  authLimiter,
  validate(ResetPasswordSchema),
  authController.resetPassword,
);
router.post("/refresh-token", authLimiter, authController.refreshToken); // Validation handled manually for cookies
router.post("/logout", authController.logout);

export default router;
