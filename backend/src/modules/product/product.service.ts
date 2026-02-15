import { prisma } from "../../config/prisma";
import { CreateProductInput } from "./dto/create-product.dto";
import { UpdateProductInput } from "./dto/update-product.dto";
import { QueryProductInput } from "./dto/query-product.dto";
import { AppError } from "../../utils/AppError";
import { productRepository } from "./product.repository";

export class ProductService {
  async createProduct(input: CreateProductInput) {
    const category = await prisma.category.findUnique({
      where: { id: input.categoryId },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return await productRepository.create(input);
  }

  async getAllProducts(query: QueryProductInput) {
    return await productRepository.findAll(query);
  }

  async getProductById(id: string) {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  }

  async updateProduct(id: string, input: UpdateProductInput) {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (input.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: input.categoryId },
      });
      if (!category) {
        throw new AppError("Category not found", 404);
      }
    }

    return await productRepository.update(id, input);
  }

  async deleteProduct(id: string) {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    await productRepository.delete(id);
  }
}

export const productService = new ProductService();
