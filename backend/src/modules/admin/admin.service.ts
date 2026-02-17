import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AdminService {
  async getDashboardStats() {
    const [totalRevenue, ordersCount, productsCount, usersCount] =
      await Promise.all([
        prisma.order.aggregate({
          _sum: {
            totalAmount: true,
          },
          where: {
            status: {
              not: "CANCELLED",
            },
          },
        }),
        prisma.order.count(),
        prisma.product.count(),
        prisma.user.count(),
      ]);

    // Get recent sales (last 5)
    const recentSales = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Get top categories based on product count
    const topCategories = await prisma.category.findMany({
      take: 5,
      select: {
        name: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        products: {
          _count: "desc",
        },
      },
    });

    return {
      revenue: totalRevenue._sum.totalAmount || 0,
      orders: ordersCount,
      products: productsCount,
      users: usersCount,
      recentSales,
      topCategories,
    };
  }
}
