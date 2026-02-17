import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { reviewService } from "./reviewService";
import type { Review, CreateReviewDto } from "../../types/review";

interface ReviewState {
  reviews: Review[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

const initialState: ReviewState = {
  reviews: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const getProductReviews = createAsyncThunk(
  "reviews/getProductReviews",
  async (productId: string, thunkAPI) => {
    try {
      return await reviewService.getProductReviews(productId);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const createReview = createAsyncThunk(
  "reviews/createReview",
  async (reviewData: CreateReviewDto, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as any;
      const token = state.auth.user.token;
      return await reviewService.createReview(reviewData, token);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (id: string, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as any;
      const token = state.auth.user.token;
      await reviewService.deleteReview(id, token);
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload;
      })
      .addCase(getProductReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(createReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reviews.unshift(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(deleteReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = state.reviews.filter(
          (review) => review.id !== action.payload,
        );
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset } = reviewSlice.actions;
export default reviewSlice.reducer;
