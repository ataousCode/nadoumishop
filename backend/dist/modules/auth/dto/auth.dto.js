"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenSchema = exports.ResetPasswordSchema = exports.ForgotPasswordSchema = exports.VerifyOtpSchema = exports.LoginSchema = exports.SignupSchema = void 0;
const zod_1 = require("zod");
exports.SignupSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
        name: zod_1.z.string().min(2, "Name must be at least 2 characters").optional(),
    }),
});
exports.LoginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string(),
    }),
});
exports.VerifyOtpSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        otp: zod_1.z.string().length(6, "OTP must be 6 digits"),
    }),
});
exports.ForgotPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
    }),
});
exports.ResetPasswordSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        token: zod_1.z.string(),
        newPassword: zod_1.z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: zod_1.z.string(),
    })
        .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }),
});
exports.RefreshTokenSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string(),
    }),
});
//# sourceMappingURL=auth.dto.js.map