import { prisma } from "../../config/prisma";

export class WishlistRepository {
  async findByUserId(userId: string) {
    return prisma.wishlist.findUnique({
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
    return prisma.wishlist.create({
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

  async addItem(wishlistId: string, productId: string) {
    return prisma.wishlistItem.create({
      data: {
        wishlistId,
        productId,
      },
      include: {
        product: true,
      },
    });
  }

  async removeItem(wishlistItemId: string) {
    return prisma.wishlistItem.delete({
      where: { id: wishlistItemId },
    });
  }

  async findItemByWishlistAndProduct(wishlistId: string, productId: string) {
    return prisma.wishlistItem.findFirst({
      where: { wishlistId, productId },
    });
  }

  async removeItemByProduct(wishlistId: string, productId: string) {
    return prisma.wishlistItem.deleteMany({
      where: { wishlistId, productId },
    });
  }
}

export const wishlistRepository = new WishlistRepository();
