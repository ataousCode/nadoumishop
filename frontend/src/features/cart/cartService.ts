import api from "../../services/api";
import type {
  CartResponse,
  AddToCartDto,
  UpdateCartItemDto,
} from "../../types/cart";

export const cartService = {
  getCart: async () => {
    const response = await api.get<CartResponse>("/cart");
    return response.data;
  },

  addToCart: async (data: AddToCartDto) => {
    const response = await api.post<CartResponse>("/cart", data);
    return response.data;
  },

  updateCartItem: async (itemId: string, data: UpdateCartItemDto) => {
    const response = await api.patch<CartResponse>(`/cart/${itemId}`, data);
    return response.data;
  },

  removeFromCart: async (itemId: string) => {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete("/cart");
    return response.data;
  },
};
