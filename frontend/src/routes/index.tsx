import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { AuthLayout } from "../components/layout/AuthLayout";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ContactPage from "../pages/ContactPage";
import VerifyOtpPage from "../pages/VerifyOtpPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

// ... (existing imports)

import { SimplePlaceholder } from "../components/common/SimplePlaceholder";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      // Protected Routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "dashboard",
            element: <SimplePlaceholder title="Dashboard (Protected)" />,
          },
          {
            path: "account",
            element: <SimplePlaceholder title="Your Account" />,
          },
        ],
      },
      {
        path: "products",
        element: <SimplePlaceholder title="Products Catalog" />,
      },
      {
        path: "cart",
        element: <SimplePlaceholder title="Shopping Cart" />,
      },
      {
        path: "help",
        element: <SimplePlaceholder title="Help Center" />,
      },
      {
        path: "*",
        element: (
          <div className="p-20 text-center text-xl">404 - Page Not Found</div>
        ),
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "verify-otp",
        element: <VerifyOtpPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "reset-password",
        element: <ResetPasswordPage />,
      },
    ],
  },
]);
