import { wishlistRepository } from "./wishlist.repository";
import { AppError } from "../../utils/AppError";

export class WishlistService {
  async getWishlist(userId: string) {
    let wishlist = await wishlistRepository.findByUserId(userId);
    if (!wishlist) {
      wishlist = await wishlistRepository.create(userId);
    }
    return wishlist;
  }

  async addToWishlist(userId: string, productId: string) {
    const wishlist = await this.getWishlist(userId);

    const existingItem = await wishlistRepository.findItemByWishlistAndProduct(
      wishlist.id,
      productId,
    );

    if (existingItem) {
      return wishlist;
    }

    await wishlistRepository.addItem(wishlist.id, productId);
    return await wishlistRepository.findByUserId(userId);
  }

  async removeFromWishlist(userId: string, productId: string) {
    const wishlist = await this.getWishlist(userId);
    await wishlistRepository.removeItemByProduct(wishlist.id, productId);
    return await wishlistRepository.findByUserId(userId);
  }
}

export const wishlistService = new WishlistService();
