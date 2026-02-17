import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { productService } from "./productService";
import type {
  ProductQuery,
  ProductState,
  ProductsResponse,
  ProductResponse,
} from "../../types/product";

interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  newArrivals: [],
  bestSellers: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  isLoading: false,
  error: null,
};

// Async Thunks
export const getProducts = createAsyncThunk(
  "products/getAll",
  async (query: ProductQuery = {}, { rejectWithValue }) => {
    try {
      const response = await productService.getAllProducts(query);
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message ||
        "Failed to fetch products";
      return rejectWithValue(errorMessage);
    }
  },
);

export const getProductById = createAsyncThunk(
  "products/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id);
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message ||
        "Failed to fetch product";
      return rejectWithValue(errorMessage);
    }
  },
);

export const getNewArrivals = createAsyncThunk(
  "products/getNewArrivals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getAllProducts({
        isNewArrival: true,
        limit: 4,
      });
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message ||
        "Failed to fetch new arrivals";
      return rejectWithValue(errorMessage);
    }
  },
);

export const getBestSellers = createAsyncThunk(
  "products/getBestSellers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getAllProducts({
        isBestSeller: true,
        limit: 4,
      });
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosErrorLike)?.response?.data?.message ||
        "Failed to fetch best sellers";
      return rejectWithValue(errorMessage);
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Products
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getProducts.fulfilled,
        (state, action: PayloadAction<ProductsResponse>) => {
          state.isLoading = false;
          state.products = action.payload.data.products;
          state.total = action.payload.data.total;
          state.page = action.payload.data.page;
          state.limit = action.payload.data.limit;
          state.totalPages = action.payload.data.totalPages;
        },
      )
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Product By ID
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getProductById.fulfilled,
        (state, action: PayloadAction<ProductResponse>) => {
          state.isLoading = false;
          state.currentProduct = action.payload.data.product;
        },
      )
      .addCase(getProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get New Arrivals
      .addCase(getNewArrivals.fulfilled, (state, action) => {
        state.newArrivals = action.payload.data.products;
      })
      // Get Best Sellers
      .addCase(getBestSellers.fulfilled, (state, action) => {
        state.bestSellers = action.payload.data.products;
      });
  },
});

export const { clearError, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
