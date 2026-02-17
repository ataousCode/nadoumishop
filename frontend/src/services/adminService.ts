import api from "./api";

export interface AdminStats {
  revenue: number;
  orders: number;
  products: number;
  users: number;
  recentSales: any[];
  topCategories: any[];
}

const adminService = {
  getStats: async () => {
    const response = await api.get<{ data: AdminStats }>("/admin/stats");
    return response.data.data;
  },
};

export default adminService;
