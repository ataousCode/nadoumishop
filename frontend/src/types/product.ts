export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  discount?: number;
  images: string[];
  imageUrl?: string;
  categoryId: string;
  category?: Category;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  createdAt: string;
  updatedAt: string;
  avgRating?: number;
  reviewCount?: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface ProductsResponse {
  status: string;
  results: number;
  data: {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductResponse {
  status: string;
  data: {
    product: Product;
  };
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
  minRating?: number;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
}

export interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  newArrivals: Product[];
  bestSellers: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}
