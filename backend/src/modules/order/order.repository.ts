import { prisma } from "../../config/prisma";
import { OrderStatus, PaymentStatus, Prisma } from "@prisma/client";

export class OrderRepository {
  async create(
    userId: string,
    totalAmount: number,
    orderItemsData: {
      productId: string;
      quantity: number;
      price: number;
    }[],
    paymentMethod: string,
    addressId?: string,
  ) {
    // Transaction to create order, order items, and initial payment record
    return prisma.$transaction(async (tx) => {
      // 1. Create Order
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          addressId,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          items: {
            create: orderItemsData.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          address: true,
          payment: true,
        },
      });

      // 2. Create Payment Record (Initial)
      await tx.payment.create({
        data: {
          orderId: order.id,
          amount: totalAmount,
          method: paymentMethod,
          status: PaymentStatus.PENDING,
        },
      });

      // 3. Update Product Stock
      for (const item of orderItemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    });
  }

  async findAllByUserId(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
        address: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
        address: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async updateAddress(id: string, addressId: string) {
    return prisma.order.update({
      where: { id },
      data: { addressId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        address: true,
        payment: true,
      },
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  async findAll() {
    return prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        address: true,
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

export const orderRepository = new OrderRepository();
