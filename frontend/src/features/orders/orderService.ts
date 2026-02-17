import api from "../../services/api";
import type {
  OrdersResponse,
  OrderResponse,
  CreateOrderDto,
  OrderPreviewResponse,
} from "../../types/order";

export const orderService = {
  getOrders: async () => {
    const response = await api.get<OrdersResponse>("/orders");
    return response.data;
  },

  getOrderById: async (id: string) => {
    const response = await api.get<OrderResponse>(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (data: CreateOrderDto) => {
    const response = await api.post<OrderResponse>("/orders", data);
    return response.data;
  },

  cancelOrder: async (id: string) => {
    const response = await api.patch<OrderResponse>(`/orders/${id}/cancel`);
    return response.data;
  },

  updateOrderAddress: async (id: string, addressId: string) => {
    const response = await api.patch<OrderResponse>(`/orders/${id}/address`, {
      addressId,
    });
    return response.data;
  },

  previewOrder: async () => {
    const response = await api.get<OrderPreviewResponse>("/orders/preview");
    return response.data;
  },
};
