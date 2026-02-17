import type { Product } from "./product";

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  updatedAt: string;
}

export interface CartResponse {
  status: string;
  data: {
    cart: Cart;
  };
}

export interface AddToCartDto {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}
