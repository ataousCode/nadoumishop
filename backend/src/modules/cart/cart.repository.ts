import { prisma } from "../../config/prisma";
import { AddToCartDto } from "./dto/cart.dto";

export class CartRepository {
  async findByUserId(userId: string) {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  }

  async create(userId: string) {
    return prisma.cart.create({
      data: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async addItem(cartId: string, data: AddToCartDto) {
    return prisma.cartItem.create({
      data: {
        cartId,
        productId: data.productId,
        quantity: data.quantity,
      },
      include: {
        product: true,
      },
    });
  }

  async updateItemQuantity(cartItemId: string, quantity: number) {
    return prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        product: true,
      },
    });
  }

  async removeItem(cartItemId: string) {
    return prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  async clearCart(cartId: string) {
    return prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }

  async findCartItem(cartId: string, productId: string) {
    return prisma.cartItem.findFirst({
      where: { cartId, productId },
    });
  }

  async findCartItemById(cartItemId: string) {
    return prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });
  }
}

export const cartRepository = new CartRepository();
