import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { orderService } from "./orderService";
import type {
  OrderState,
  OrdersResponse,
  OrderResponse,
  OrderPreviewResponse,
  CreateOrderDto,
} from "../../types/order";

interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  preview: null,
  isLoading: false,
  error: null,
};

export const getOrders = createAsyncThunk(
  "orders/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrders();
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message ||
        "Failed to fetch orders";
      return rejectWithValue(errorMessage);
    }
  },
);

export const getOrderById = createAsyncThunk(
  "orders/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderById(id);
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message ||
        "Failed to fetch order";
      return rejectWithValue(errorMessage);
    }
  },
);

export const previewOrder = createAsyncThunk(
  "orders/preview",
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderService.previewOrder();
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message ||
        "Failed to preview order";
      return rejectWithValue(errorMessage);
    }
  },
);

export const createOrder = createAsyncThunk(
  "orders/create",
  async (data: CreateOrderDto, { rejectWithValue }) => {
    try {
      const response = await orderService.createOrder(data);
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message ||
        "Failed to create order";
      return rejectWithValue(errorMessage);
    }
  },
);

export const cancelOrder = createAsyncThunk(
  "orders/cancel",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await orderService.cancelOrder(id);
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message ||
        "Failed to cancel order";
      return rejectWithValue(errorMessage);
    }
  },
);

export const updateOrderAddress = createAsyncThunk(
  "orders/updateAddress",
  async (
    { id, addressId }: { id: string; addressId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await orderService.updateOrderAddress(id, addressId);
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message ||
        "Failed to update shipping address";
      return rejectWithValue(errorMessage);
    }
  },
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearOrderPreview: (state) => {
      state.preview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Orders
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getOrders.fulfilled,
        (state, action: PayloadAction<OrdersResponse>) => {
          state.isLoading = false;
          state.orders = action.payload.data.orders;
        },
      )
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Order By ID
      .addCase(getOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getOrderById.fulfilled,
        (state, action: PayloadAction<OrderResponse>) => {
          state.isLoading = false;
          state.currentOrder = action.payload.data.order;
        },
      )
      .addCase(getOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Preview Order
      .addCase(previewOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        previewOrder.fulfilled,
        (state, action: PayloadAction<OrderPreviewResponse>) => {
          state.isLoading = false;
          state.preview = action.payload.data.review;
        },
      )
      .addCase(previewOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<OrderResponse>) => {
          state.isLoading = false;
          state.orders.unshift(action.payload.data.order);
          state.currentOrder = action.payload.data.order;
          state.preview = null;
        },
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        cancelOrder.fulfilled,
        (state, action: PayloadAction<OrderResponse>) => {
          state.isLoading = false;
          const index = state.orders.findIndex(
            (o) => o.id === action.payload.data.order.id,
          );
          if (index !== -1) {
            state.orders[index] = action.payload.data.order;
          }
          if (state.currentOrder?.id === action.payload.data.order.id) {
            state.currentOrder = action.payload.data.order;
          }
        },
      )
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Order Address
      .addCase(updateOrderAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateOrderAddress.fulfilled,
        (state, action: PayloadAction<OrderResponse>) => {
          state.isLoading = false;
          const index = state.orders.findIndex(
            (o) => o.id === action.payload.data.order.id,
          );
          if (index !== -1) {
            state.orders[index] = action.payload.data.order;
          }
          if (state.currentOrder?.id === action.payload.data.order.id) {
            state.currentOrder = action.payload.data.order;
          }
        },
      )
      .addCase(updateOrderAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOrderError, clearOrderPreview } = orderSlice.actions;
export default orderSlice.reducer;
