import api from "../../services/api";
import type { Product } from "../../types/product";

export interface WishlistItem {
  id: string;
  wishlistId: string;
  productId: string;
  product: Product;
  createdAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
  updatedAt: string;
}

export const wishlistService = {
  getWishlist: async () => {
    const response = await api.get<{
      status: string;
      data: { wishlist: Wishlist };
    }>("/wishlist");
    return response.data;
  },

  addToWishlist: async (productId: string) => {
    const response = await api.post<{
      status: string;
      data: { wishlist: Wishlist };
    }>("/wishlist", { productId });
    return response.data;
  },

  removeFromWishlist: async (productId: string) => {
    const response = await api.delete<{
      status: string;
      data: { wishlist: Wishlist };
    }>(`/wishlist/${productId}`);
    return response.data;
  },
};
