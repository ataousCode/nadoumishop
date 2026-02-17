import { CreateOrderDto } from "./dto/order.dto";
import { orderRepository } from "./order.repository";
import { cartService } from "../cart/cart.service";
import { addressService } from "../address/address.service";
import { paymentService } from "../payment/payment.service";
import { AppError } from "../../utils/AppError";
import { OrderStatus } from "@prisma/client";
import { notificationService } from "../notification/notification.service";

export class OrderService {
  async createOrder(userId: string, input: CreateOrderDto) {
    // 1. Validate Address (ensure it exists and belongs to user)
    await addressService.getAddressById(userId, input.addressId);

    // 2. Get Cart Items
    const cart = await cartService.getCart(userId);

    if (!cart || cart.items.length === 0) {
      throw new AppError("Cart is empty", 400);
    }

    // 3. Calculate Total and Prepare Order Items
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of cart.items) {
      // Re-check stock just in case
      if (item.product.stock < item.quantity) {
        throw new AppError(`Not enough stock for ${item.product.name}`, 400);
      }

      const itemTotal = Number(item.product.price) * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.product.price), // Snapshot price
      });
    }

    // 4. Create Order
    const order = await orderRepository.create(
      userId,
      totalAmount,
      orderItemsData,
      input.paymentMethod,
      input.addressId,
    );

    // 5. Process Payment (After order creation to have orderId)
    try {
      await paymentService.processPayment(
        input.paymentMethod,
        order.id,
        totalAmount,
        {},
      );
    } catch (error) {
      throw error;
    }

    // 6. Clear Cart
    await cartService.clearCart(userId);

    // 7. Trigger Notification
    await notificationService.createNotification({
      title: "New Order Created",
      message: `Order #${order.id} has been placed successfully.`,
      type: "ORDER",
      userId,
    });

    return order;
  }

  async reviewOrder(userId: string) {
    const cart = await cartService.getCart(userId);

    if (!cart || cart.items.length === 0) {
      throw new AppError("Cart is empty", 400);
    }

    let subtotal = 0;
    const items = cart.items.map((item) => {
      const total = Number(item.product.price) * item.quantity;
      subtotal += total;
      return {
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: Number(item.product.price),
        total,
      };
    });

    const tax = 0;
    const shipping = 0;
    const total = subtotal + tax + shipping;

    return {
      items,
      subtotal,
      tax,
      shipping,
      total,
    };
  }

  async getUserOrders(userId: string) {
    return await orderRepository.findAllByUserId(userId);
  }

  async getOrderById(userId: string, orderId: string) {
    const order = await orderRepository.findById(orderId);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    // Check ownership
    if (order.userId !== userId) {
      throw new AppError("You do not have permission to view this order", 403);
    }

    return order;
  }

  async updateOrderAddress(userId: string, orderId: string, addressId: string) {
    const order = await this.getOrderById(userId, orderId);

    if (order.status !== "PENDING" && order.status !== "PROCESSING") {
      throw new AppError(
        "Shipping address cannot be changed at this stage",
        400,
      );
    }

    // Validate new address
    await addressService.getAddressById(userId, addressId);

    return await orderRepository.updateAddress(orderId, addressId);
  }

  async cancelOrder(userId: string, orderId: string) {
    const order = await this.getOrderById(userId, orderId);

    if (order.status !== "PENDING" && order.status !== "PROCESSING") {
      throw new AppError("Order cannot be cancelled at this stage", 400);
    }

    const updatedOrder = await orderRepository.updateStatus(
      orderId,
      OrderStatus.CANCELLED,
    );

    // Trigger Notification
    await notificationService.createNotification({
      title: "Order Cancelled",
      message: `Your order #${orderId} has been cancelled.`,
      type: "CANCELATION",
      userId,
    });

    return updatedOrder;
  }

  async getAllOrders() {
    return await orderRepository.findAll();
  }
}

export const orderService = new OrderService();
