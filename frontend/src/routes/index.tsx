import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { AuthLayout } from "../components/layout/AuthLayout";
import VerifyOtpPage from "../pages/VerifyOtpPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import { ProductListPage } from "../pages/ProductListPage";
import { ProductDetailsPage } from "../pages/ProductDetailsPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import OrderSuccessPage from "../pages/OrderSuccessPage";
import OrderHistoryPage from "../pages/OrderHistoryPage";
import SettingsPage from "../pages/SettingsPage";
import AccountHubPage from "../pages/AccountHubPage";
import AddressPage from "../pages/AddressPage";
import OrderDetailsPage from "../pages/OrderDetailsPage";
import { WishlistPage } from "../pages/WishlistPage";
import PaymentPage from "../pages/PaymentPage";
import { AdminLayout } from "../layouts/AdminLayout";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminSettingsPage from "../pages/admin/AdminSettingsPage";
import AdminCategoriesPage from "../pages/admin/AdminCategoriesPage";
import { TodaysDealsPage } from "../pages/TodaysDealsPage";
import { CustomerServicePage } from "../pages/CustomerServicePage";
import { RegistryPage } from "../pages/RegistryPage";
import { GiftCardsPage } from "../pages/GiftCardsPage";
import { SellPage } from "../pages/SellPage";
import { lazy } from "react";
const AdminProfilePage = lazy(() => import("../pages/admin/AdminProfilePage"));
const AdminNotificationsPage = lazy(
  () => import("../pages/admin/AdminNotificationsPage"),
);

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductListPage /> },
      { path: "/products/:id", element: <ProductDetailsPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/today", element: <TodaysDealsPage /> },
      { path: "/customer-service", element: <CustomerServicePage /> },
      { path: "/registry", element: <RegistryPage /> },
      { path: "/gift-cards", element: <GiftCardsPage /> },
      { path: "/sell", element: <SellPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/checkout",
            element: <CheckoutPage />,
          },
          {
            path: "/order-success",
            element: <OrderSuccessPage />,
          },
          {
            path: "/orders",
            element: <OrderHistoryPage />,
          },
          {
            path: "/orders/:id",
            element: <OrderDetailsPage />,
          },
          {
            path: "/dashboard",
            element: <AccountHubPage />,
          },
          {
            path: "/dashboard/settings",
            element: <SettingsPage />,
          },
          {
            path: "/dashboard/addresses",
            element: <AddressPage />,
          },
          {
            path: "/wishlist",
            element: <WishlistPage />,
          },
          {
            path: "/dashboard/payment",
            element: <PaymentPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: "products", element: <AdminProductsPage /> },
          { path: "categories", element: <AdminCategoriesPage /> },
          { path: "orders", element: <AdminOrdersPage /> },
          { path: "users", element: <AdminUsersPage /> },
          { path: "profile", element: <AdminProfilePage /> },
          { path: "notifications", element: <AdminNotificationsPage /> },
          { path: "settings", element: <AdminSettingsPage /> },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "verify-otp", element: <VerifyOtpPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
    ],
  },
]);
