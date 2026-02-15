import api from "../../services/api";
import type {
  LoginDto,
  SignupDto,
  User,
  VerifyOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "../../types/auth";

// Placeholder types until we create the types file
export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpires: string;
}

export const authService = {
  signup: async (data: SignupDto) => {
    const response = await api.post("/auth/signup", data);
    return response.data;
  },

  login: async (data: LoginDto) => {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  checkAuth: async () => {
    const response = await api.get<{ status: string; data: { user: User } }>(
      "/users/me",
    );
    return response.data.data.user;
  },

  verifyOtp: async (data: VerifyOtpDto) => {
    const response = await api.post("/auth/verify-otp", data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordDto) => {
    const response = await api.post("/auth/forgot-password", data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordDto) => {
    const response = await api.post("/auth/reset-password", {
      newPassword: data.password,
      token: data.token,
    });
    return response.data;
  },
};
