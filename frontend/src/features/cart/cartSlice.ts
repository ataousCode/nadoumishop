import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { cartService } from "./cartService";
import type {
  CartState,
  CartResponse,
  AddToCartDto,
  UpdateCartItemDto,
} from "../../types/cart";

interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

export const getCart = createAsyncThunk(
  "cart/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message ||
        "Failed to fetch cart";
      return rejectWithValue(errorMessage);
    }
  },
);

export const addToCart = createAsyncThunk(
  "cart/add",
  async (data: AddToCartDto, { rejectWithValue }) => {
    try {
      const response = await cartService.addToCart(data);
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message ||
        "Failed to add item to cart";
      return rejectWithValue(errorMessage);
    }
  },
);

export const updateCartItem = createAsyncThunk(
  "cart/updateItem",
  async (
    { itemId, data }: { itemId: string; data: UpdateCartItemDto },
    { rejectWithValue },
  ) => {
    try {
      const response = await cartService.updateCartItem(itemId, data);
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message ||
        "Failed to update cart item";
      return rejectWithValue(errorMessage);
    }
  },
);

export const removeFromCart = createAsyncThunk(
  "cart/removeItem",
  async (itemId: string, { rejectWithValue, dispatch }) => {
    try {
      await cartService.removeFromCart(itemId);
      dispatch(getCart());
      return itemId;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message ||
        "Failed to remove item from cart";
      return rejectWithValue(errorMessage);
    }
  },
);

export const clearCart = createAsyncThunk(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      await cartService.clearCart();
      return null;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message ||
        "Failed to clear cart";
      return rejectWithValue(errorMessage);
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Cart
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getCart.fulfilled,
        (state, action: PayloadAction<CartResponse>) => {
          state.isLoading = false;
          state.cart = action.payload.data.cart;
        },
      )
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add To Cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        addToCart.fulfilled,
        (state, action: PayloadAction<CartResponse>) => {
          state.isLoading = false;
          state.cart = action.payload.data.cart;
        },
      )
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateCartItem.fulfilled,
        (state, action: PayloadAction<CartResponse>) => {
          state.isLoading = false;
          state.cart = action.payload.data.cart;
        },
      )
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        if (state.cart) {
          state.cart.items = [];
        }
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Clear Cart on Logout (Listen to auth/logout)
      .addMatcher(
        (action) => action.type === "auth/logout/fulfilled",
        (state) => {
          state.cart = null;
          state.error = null;
        },
      );
  },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
