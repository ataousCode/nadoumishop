import axios from "axios";
import type {
  Review,
  CreateReviewDto,
  ProductReviewsResponse,
  CreateReviewResponse,
} from "../../types/review";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1";

const getProductReviews = async (productId: string): Promise<Review[]> => {
  const response = await axios.get<ProductReviewsResponse>(
    `${API_URL}/reviews/product/${productId}`,
  );
  return response.data.data.reviews;
};

const createReview = async (
  reviewData: CreateReviewDto,
  token: string,
): Promise<Review> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post<CreateReviewResponse>(
    `${API_URL}/reviews`,
    reviewData,
    config,
  );
  return response.data.data.review;
};

const deleteReview = async (id: string, token: string): Promise<void> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  await axios.delete(`${API_URL}/reviews/${id}`, config);
};

export const reviewService = {
  getProductReviews,
  createReview,
  deleteReview,
};
