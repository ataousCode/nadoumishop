import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { CreateProductInput } from "./dto/create-product.dto";
import { UpdateProductInput } from "./dto/update-product.dto";
import { QueryProductInput } from "./dto/query-product.dto";

export class ProductRepository {
  async create(data: CreateProductInput) {
    return prisma.product.create({
      data,
    });
  }

  async findAll(query: QueryProductInput) {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      sort,
      minRating,
      page = 1,
      limit = 10,
    } = query;

    const where: Prisma.ProductWhereInput = {};

    if (category) {
      where.category = {
        name: category,
      };
    }

    if (query.isNewArrival !== undefined) {
      where.isNewArrival = query.isNewArrival;
    }

    if (query.isBestSeller !== undefined) {
      where.isBestSeller = query.isBestSeller;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = Number(minPrice);
      if (maxPrice !== undefined) where.price.lte = Number(maxPrice);
    }

    if (minRating !== undefined) {
      where.reviews = {
        some: {},
      };
      // Note: Truly filtering by average rating in Prisma findMany 'where' is complex
      // without a denormalized field. For now, we'll return all and possibly filter in memory
      // or implement a more advanced raw query if performance becomes an issue.
      // However, we can at least filter for products that HAVE reviews if minRating > 0.
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };

    if (sort) {
      if (sort === "price-asc") orderBy = { price: "asc" };
      else if (sort === "price-desc") orderBy = { price: "desc" };
      else if (sort === "newest") orderBy = { createdAt: "desc" };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        skip,
        take,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate aggregates and filter by minRating if provided
    let results = products.map((p) => {
      const reviewCount = p.reviews.length;
      const avgRating =
        reviewCount > 0
          ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
          : 0;

      return {
        ...p,
        reviewCount,
        avgRating,
      };
    });

    if (minRating !== undefined) {
      results = results.filter((p) => p.avgRating >= Number(minRating));
    }

    const finalTotal = minRating !== undefined ? results.length : total;

    return {
      products: results,
      total: finalTotal,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(finalTotal / limit),
    };
  }

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: true,
      },
    });
  }

  async update(id: string, data: UpdateProductInput) {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}

export const productRepository = new ProductRepository();
