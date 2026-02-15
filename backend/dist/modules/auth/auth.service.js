"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../../utils/AppError");
const eventBus_1 = require("../notification/events/eventBus");
const notification_events_1 = require("../notification/events/notification.events");
const auth_repository_1 = require("./auth.repository");
const user_repository_1 = require("../user/user.repository");
const authRepository = new auth_repository_1.AuthRepository();
const userRepository = new user_repository_1.UserRepository();
const otp_service_1 = require("../notification/otp/otp.service");
// ...
class AuthService {
    // Remove private generateOtp method
    generateTokens(userId) {
        const accessToken = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: (process.env.JWT_ACCESS_EXPIRATION || "15m"),
        });
        const refreshToken = crypto_1.default.randomBytes(40).toString("hex");
        const refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        return { accessToken, refreshToken, refreshTokenExpires };
    }
    async signup(dto) {
        // ...
        const hashedPassword = await bcrypt_1.default.hash(dto.password, 12);
        const { otp, expires } = otp_service_1.OtpService.generate();
        const user = await userRepository.create({
            // ...
            email: dto.email,
            password: hashedPassword,
            name: dto.name,
            otp,
            otpExpires: expires,
        });
        eventBus_1.eventBus.emit(notification_events_1.EVENTS.USER.REGISTERED, {
            email: user.email,
            name: user.name || "User",
            otp,
        });
        return { message: "User created. Please check your email for OTP." };
    }
    async login(dto) {
        const user = await userRepository.findByEmail(dto.email);
        if (!user) {
            throw new AppError_1.AppError("Invalid email or password", 401);
        }
        if (user.lockoutUntil && user.lockoutUntil > new Date()) {
            throw new AppError_1.AppError("Account locked. Try again later.", 429);
        }
        const isPasswordValid = await bcrypt_1.default.compare(dto.password, user.password);
        if (!isPasswordValid) {
            await userRepository.update(user.id, {
                loginAttempts: { increment: 1 },
                lockoutUntil: user.loginAttempts >= 4
                    ? new Date(Date.now() + 15 * 60 * 1000)
                    : null,
            });
            throw new AppError_1.AppError("Invalid email or password", 401);
        }
        await userRepository.update(user.id, {
            loginAttempts: 0,
            lockoutUntil: null,
        });
        const { accessToken, refreshToken, refreshTokenExpires } = this.generateTokens(user.id);
        await authRepository.createRefreshToken({
            token: refreshToken,
            userId: user.id,
            expiresAt: refreshTokenExpires,
        });
        return { user, accessToken, refreshToken };
    }
    async verifyOtp(dto) {
        const user = await userRepository.findByEmail(dto.email);
        if (!user ||
            user.otp !== dto.otp ||
            !user.otpExpires ||
            user.otpExpires < new Date()) {
            throw new AppError_1.AppError("Invalid or expired OTP", 400);
        }
        await userRepository.update(user.id, {
            isVerified: true,
            otp: null,
            otpExpires: null,
        });
        const { accessToken, refreshToken, refreshTokenExpires } = this.generateTokens(user.id);
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
    async forgotPassword(dto) {
        const user = await userRepository.findByEmail(dto.email);
        if (!user) {
            return { message: "If email exists, a reset link has been sent." };
        }
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const hashedToken = crypto_1.default
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        await userRepository.update(user.id, {
            passwordResetToken: hashedToken,
            passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000),
        });
        const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`;
        eventBus_1.eventBus.emit(notification_events_1.EVENTS.USER.FORGOT_PASSWORD, {
            email: user.email,
            name: user.name || "User",
            resetLink: resetUrl,
        });
        return { message: "If email exists, a reset link has been sent." };
    }
    async resetPassword(dto) {
        const hashedToken = crypto_1.default
            .createHash("sha256")
            .update(dto.token)
            .digest("hex");
        const user = await userRepository.findByResetToken(hashedToken);
        if (!user) {
            throw new AppError_1.AppError("Invalid or expired token", 400);
        }
        const hashedPassword = await bcrypt_1.default.hash(dto.newPassword, 12);
        await userRepository.update(user.id, {
            password: hashedPassword,
            passwordResetToken: null,
            passwordResetExpires: null,
        });
        return { message: "Password reset successfully. Please login." };
    }
    async refreshTokens(refreshTokenDto) {
        const existingToken = await authRepository.findRefreshToken(refreshTokenDto.refreshToken);
        if (!existingToken ||
            existingToken.revoked ||
            existingToken.expiresAt < new Date()) {
            throw new AppError_1.AppError("Invalid or expired refresh token", 401);
        }
        const { accessToken, refreshToken, refreshTokenExpires } = this.generateTokens(existingToken.userId);
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
    async logout(refreshToken) {
        await authRepository.revokeRefreshToken(refreshToken);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map