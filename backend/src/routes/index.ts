import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/user/user.routes";
import notificationRoutes from "../modules/notification/notification.routes";
import categoryRoutes from "../modules/category/category.routes";
import productRoutes from "../modules/product/product.routes";
import addressRoutes from "../modules/address/address.routes";
import cartRoutes from "../modules/cart/cart.routes";
import orderRoutes from "../modules/order/order.routes";
import wishlistRoutes from "../modules/wishlist/wishlist.routes";
import adminRoutes from "../modules/admin/admin.routes";
import paymentRoutes from "../modules/payment/payment.routes";
import reviewRoutes from "../modules/review/review.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/notifications", notificationRoutes);
router.use("/admin", adminRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/addresses", addressRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/payment", paymentRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/reviews", reviewRoutes);

export default router;
