import { z } from "zod";

export const SignupSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
  }),
});

export const LoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const VerifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email(),
    otp: z.string().length(6, "OTP must be 6 digits"),
  }),
});

export const ForgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export const ResetPasswordSchema = z.object({
  body: z
    .object({
      token: z.string(),
      newPassword: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});

export const RefreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

export type SignupDto = z.infer<typeof SignupSchema>["body"];
export type LoginDto = z.infer<typeof LoginSchema>["body"];
export type VerifyOtpDto = z.infer<typeof VerifyOtpSchema>["body"];
export type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>["body"];
export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>["body"];
export type RefreshTokenDto = z.infer<typeof RefreshTokenSchema>["body"];
