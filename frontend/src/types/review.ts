export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
  };
}

export interface CreateReviewDto {
  productId: string;
  rating: number;
  comment: string;
}

export interface ProductReviewsResponse {
  status: string;
  results: number;
  data: {
    reviews: Review[];
  };
}

export interface CreateReviewResponse {
  status: string;
  data: {
    review: Review;
  };
}
