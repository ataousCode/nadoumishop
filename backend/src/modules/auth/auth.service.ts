import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../../utils/AppError";
import {
  SignupDto,
  LoginDto,
  VerifyOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "./dto/auth.dto";
import { eventBus } from "../notification/events/eventBus";
import { EVENTS } from "../notification/events/notification.events";
import { AuthRepository } from "./auth.repository";
import { UserRepository } from "../user/user.repository";
import logger from "../../utils/logger";
import { env } from "../../config/env";

const authRepository = new AuthRepository();
const userRepository = new UserRepository();

import { OtpService } from "../notification/otp/otp.service";

// ...

export class AuthService {
  // Remove private generateOtp method

  private generateTokens(userId: string) {
    const accessToken = jwt.sign({ userId }, env.JWT_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRATION as any,
    });

    const refreshToken = crypto.randomBytes(40).toString("hex");
    const refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    return { accessToken, refreshToken, refreshTokenExpires };
  }

  async signup(dto: SignupDto) {
    logger.info(`Signup started for: ${dto.email}`);
    const existingUser = await userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new AppError("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    logger.debug("Password hashed");

    const { otp, expires } = OtpService.generate();

    logger.debug("Creating user in DB...");
    const user = await userRepository.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      otp,
      otpExpires: expires,
    });
    logger.info(`User created: ${user.id}`);

    logger.debug("Emitting registration event...");
    eventBus.emit(EVENTS.USER.REGISTERED, {
      email: user.email,
      name: user.name || "User",
      otp,
    });
    logger.debug("Event emitted");

    return { message: "User created. Please check your email for OTP." };
  }

  async login(dto: LoginDto) {
    const user = await userRepository.findByEmail(dto.email);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      throw new AppError("Account locked. Try again later.", 429);
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      await userRepository.update(user.id, {
        loginAttempts: { increment: 1 },
        lockoutUntil:
          user.loginAttempts >= 4
            ? new Date(Date.now() + 15 * 60 * 1000)
            : null,
      });
      throw new AppError("Invalid email or password", 401);
    }

    await userRepository.update(user.id, {
      loginAttempts: 0,
      lockoutUntil: null,
    });

    const { accessToken, refreshToken, refreshTokenExpires } =
      this.generateTokens(user.id);

    await authRepository.createRefreshToken({
      token: refreshToken,
      userId: user.id,
      expiresAt: refreshTokenExpires,
    });

    return { user, accessToken, refreshToken };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await userRepository.findByEmail(dto.email);

    if (
      !user ||
      user.otp !== dto.otp ||
      !user.otpExpires ||
      user.otpExpires < new Date()
    ) {
      throw new AppError("Invalid or expired OTP", 400);
    }

    await userRepository.update(user.id, {
      isVerified: true,
      otp: null,
      otpExpires: null,
    });

    const { accessToken, refreshToken, refreshTokenExpires } =
      this.generateTokens(user.id);

    await authRepository.createRefreshToken({
      token: refreshToken,
      userId: user.id,
      expiresAt: refreshTokenExpires,
    });

    return {
      message: "Email verified successfully",
      accessToken,
      refreshToken,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await userRepository.findByEmail(dto.email);

    if (!user) {
      return { message: "If email exists, a reset link has been sent." };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await userRepository.update(user.id, {
      passwordResetToken: hashedToken,
      passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000),
    });

    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    eventBus.emit(EVENTS.USER.FORGOT_PASSWORD, {
      email: user.email,
      name: user.name || "User",
      resetLink: resetUrl,
    });

    return { message: "If email exists, a reset link has been sent." };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const hashedToken = crypto
      .createHash("sha256")
      .update(dto.token)
      .digest("hex");

    const user = await userRepository.findByResetToken(hashedToken);

    if (!user) {
      throw new AppError("Invalid or expired token", 400);
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);

    await userRepository.update(user.id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    return { message: "Password reset successfully. Please login." };
  }

  async refreshTokens(refreshTokenDto: { refreshToken: string }) {
    const existingToken = await authRepository.findRefreshToken(
      refreshTokenDto.refreshToken,
    );

    if (
      !existingToken ||
      existingToken.revoked ||
      existingToken.expiresAt < new Date()
    ) {
      throw new AppError("Invalid or expired refresh token", 401);
    }

    const { accessToken, refreshToken, refreshTokenExpires } =
      this.generateTokens(existingToken.userId);

    await authRepository.updateRefreshToken(existingToken.id, {
      revoked: true,
      replacedByToken: refreshToken,
    });

    await authRepository.createRefreshToken({
      token: refreshToken,
      userId: existingToken.userId,
      expiresAt: refreshTokenExpires,
    });

    return { accessToken, refreshToken };
  }

  async logout(refreshToken: string) {
    await authRepository.revokeRefreshToken(refreshToken);
  }
}
