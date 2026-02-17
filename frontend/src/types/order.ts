import type { Product } from "./product";
import type { Address } from "./address";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  shipping: number;
  tax: number;
  total: number;
  totalAmount: number; // Mapping backend totalAmount
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  address?: Address;
  payment?: {
    method: string;
    transactionId?: string;
  };
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  addressId: string;
  paymentMethod: "COD";
}

export interface OrderPreview {
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface OrderPreviewResponse {
  status: string;
  data: {
    review: OrderPreview;
  };
}

export interface OrderResponse {
  status: string;
  data: {
    order: Order;
  };
}

export interface OrdersResponse {
  status: string;
  results: number;
  data: {
    orders: Order[];
  };
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  preview: OrderPreview | null;
  isLoading: boolean;
  error: string | null;
}
