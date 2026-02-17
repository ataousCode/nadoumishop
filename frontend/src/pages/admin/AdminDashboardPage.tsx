import {
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import type { AdminStats } from "../../services/adminService";
import { formatCurrency } from "../../lib/utils";
import { format } from "date-fns";

const AdminDashboardPage = () => {
  const [statsData, setStatsData] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getStats();
        setStatsData(data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statsList = [
    {
      title: "Total Revenue",
      value: statsData ? formatCurrency(statsData.revenue) : "$0.00",
      icon: DollarSign,
      change: "+0%",
      trend: "up",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Orders",
      value: statsData?.orders.toString() || "0",
      icon: ShoppingBag,
      change: "+0%",
      trend: "up",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Products",
      value: statsData?.products.toString() || "0",
      icon: Package,
      change: "+0",
      trend: "up",
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      title: "Active Users",
      value: statsData?.users.toString() || "0",
      icon: Users,
      change: "+0",
      trend: "up",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="text-gray-500 font-medium">
            Loading dashboard stats...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard Overview
        </h2>
        <p className="text-gray-500 mt-1">
          Detailed statistics about your shop performance.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsList.map((stat) => (
          <Card
            key={stat.title}
            className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
              <div
                className={`${stat.bg} ${stat.color} p-2 rounded-lg transition-colors group-hover:scale-110 duration-200`}
              >
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <p className="text-xs mt-2 flex items-center gap-1">
                {stat.trend === "up" ? (
                  <span className="text-green-600 font-medium flex items-center">
                    <ArrowUpRight className="h-3 w-3" /> {stat.change}
                  </span>
                ) : (
                  <span className="text-red-600 font-medium flex items-center">
                    <ArrowDownRight className="h-3 w-3" /> {stat.change}
                  </span>
                )}
                <span className="text-gray-400">from last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statsData && statsData.recentSales.length > 0 ? (
                statsData.recentSales.map((sale: any) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                        {sale.user.name?.[0] || "U"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {sale.user.name || "Anonymous"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {sale.user.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {formatCurrency(Number(sale.totalAmount))}
                      </p>
                      <p className="text-xs text-gray-400">
                        {format(new Date(sale.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-40 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed">
                  No recent sales found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statsData && statsData.topCategories.length > 0 ? (
                statsData.topCategories.map((cat: any) => (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium text-gray-900">
                      {cat.name}
                    </span>
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-orange-600 border border-orange-100">
                      {cat._count.products} Products
                    </span>
                  </div>
                ))
              ) : (
                <div className="h-40 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed">
                  No category data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
