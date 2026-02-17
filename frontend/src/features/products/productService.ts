import api from "../../services/api";
import type {
  ProductQuery,
  ProductResponse,
  ProductsResponse,
} from "../../types/product";

export const productService = {
  getAllProducts: async (query: ProductQuery = {}) => {
    const params = new URLSearchParams();
    if (query.page) params.append("page", query.page.toString());
    if (query.limit) params.append("limit", query.limit.toString());
    if (query.category) params.append("category", query.category);
    if (query.minPrice) params.append("minPrice", query.minPrice.toString());
    if (query.maxPrice) params.append("maxPrice", query.maxPrice.toString());
    if (query.search) params.append("search", query.search);
    if (query.sort) params.append("sort", query.sort);
    if (query.isNewArrival) params.append("isNewArrival", "true");
    if (query.isBestSeller) params.append("isBestSeller", "true");

    const response = await api.get<ProductsResponse>(
      `/products?${params.toString()}`,
    );
    return response.data;
  },

  getProductById: async (id: string) => {
    const response = await api.get<ProductResponse>(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData: any) => {
    const response = await api.post<ProductResponse>("/products", productData);
    return response.data;
  },

  updateProduct: async (id: string, productData: any) => {
    const response = await api.patch<ProductResponse>(
      `/products/${id}`,
      productData,
    );
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
