import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { authService } from "./authService";
import type {
  AuthState,
  LoginDto,
  SignupDto,
  User,
  VerifyOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "../../types/auth";

// Define a type for the error structure we expect from Axios
interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false, // New state to track if we've checked for session
  error: null,
  message: null,
};

// Async Thunks
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.checkAuth();
      return user;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message ||
        "Failed to authenticate";
      return rejectWithValue(errorMessage);
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginDto, { rejectWithValue }) => {
    try {
      const response = await authService.login(data);
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message || "Login failed";
      return rejectWithValue(errorMessage);
    }
  },
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (data: SignupDto, { rejectWithValue }) => {
    try {
      const response = await authService.signup(data);
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message || "Signup failed";
      return rejectWithValue(errorMessage);
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data: VerifyOtpDto, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOtp(data);
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message ||
        "OTP Verification failed";
      return rejectWithValue(errorMessage);
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data: ForgotPasswordDto, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(data);
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message ||
        "Forgot Password request failed";
      return rejectWithValue(errorMessage);
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: ResetPasswordDto, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(data);
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message ||
        "Reset Password failed";
      return rejectWithValue(errorMessage);
    }
  },
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(data);
      return response.data.user;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message ||
        "Update Profile failed";
      return rejectWithValue(errorMessage);
    }
  },
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await authService.updatePassword(data);
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message ||
        "Update Password failed";
      return rejectWithValue(errorMessage);
    }
  },
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isInitialized = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.isInitialized = true;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.isLoading = false;
        // Signup usually requires verification, so we don't auto-login unless API returns token
        // For now, we might want to redirect to login or show success message
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        localStorage.removeItem("accessToken");
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true; // Auto-login after verification? Based on backend response
        state.user = null; // Backend returns access token but maybe not user object directly? verifyOtp returns { message, accessToken, refreshToken }
        if (action.payload.accessToken) {
          localStorage.setItem("accessToken", action.payload.accessToken);
          state.isAuthenticated = true;
          // We might need to fetch user profile or decode token to set user
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(
        forgotPassword.fulfilled,
        (state, action: PayloadAction<{ message: string }>) => {
          state.isLoading = false;
          state.message = action.payload.message;
        },
      )
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(
        resetPassword.fulfilled,
        (state, action: PayloadAction<{ message: string }>) => {
          state.isLoading = false;
          state.message = action.payload.message;
        },
      )
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.isLoading = false;
          state.user = action.payload;
          state.message = "Profile updated successfully";
        },
      )
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Password
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.message = "Password updated successfully";
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setInitialized } = authSlice.actions;
export default authSlice.reducer;
