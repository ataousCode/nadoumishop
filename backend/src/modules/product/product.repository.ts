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
      page = 1,
      limit = 10,
    } = query;

    // Explicitly type 'where' to match Prisma's expected input
    const where: any = {};

    if (category) {
      const categoryRecord = await prisma.category.findUnique({
        where: { name: category },
      });
      if (categoryRecord) {
        where.categoryId = categoryRecord.id;
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
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
