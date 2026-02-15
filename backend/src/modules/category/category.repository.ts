import { prisma } from "../../config/prisma";
import { CreateCategoryInput } from "./dto/create-category.dto";
import { UpdateCategoryInput } from "./dto/update-category.dto";

export class CategoryRepository {
  async create(data: CreateCategoryInput) {
    return prisma.category.create({
      data,
    });
  }

  async findAll() {
    return prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async findByName(name: string) {
    return prisma.category.findUnique({
      where: { name },
    });
  }

  async update(id: string, data: UpdateCategoryInput) {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  }
}

export const categoryRepository = new CategoryRepository();
