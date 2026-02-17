import api from "../../services/api";
import type { Category } from "../../types/product";

export const categoryService = {
  getAllCategories: async () => {
    const response = await api.get<{
      status: string;
      results: number;
      data: { categories: Category[] };
    }>("/categories");
    return response.data;
  },

  getCategoryById: async (id: string) => {
    const response = await api.get<{
      status: string;
      data: { category: Category };
    }>(`/categories/${id}`);
    return response.data;
  },
};
