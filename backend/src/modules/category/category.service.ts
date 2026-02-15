import { CreateCategoryInput } from "./dto/create-category.dto";
import { UpdateCategoryInput } from "./dto/update-category.dto";
import { AppError } from "../../utils/AppError";
import { categoryRepository } from "./category.repository";

export class CategoryService {
  async createCategory(input: CreateCategoryInput) {
    const existingCategory = await categoryRepository.findByName(input.name);

    if (existingCategory) {
      throw new AppError("Category with this name already exists", 400);
    }

    return await categoryRepository.create(input);
  }

  async getAllCategories() {
    return await categoryRepository.findAll();
  }

  async getCategoryById(id: string) {
    const category = await categoryRepository.findById(id);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return category;
  }

  async updateCategory(id: string, input: UpdateCategoryInput) {
    const category = await categoryRepository.findById(id);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    if (input.name) {
      const existingCategory = await categoryRepository.findByName(input.name);
      if (existingCategory && existingCategory.id !== id) {
        throw new AppError("Category with this name already exists", 400);
      }
    }

    return await categoryRepository.update(id, input);
  }

  async deleteCategory(id: string) {
    const category = await categoryRepository.findById(id);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    // Optional: Check if category has products before deleting
    // const products = await productRepository.findByCategoryId(id);
    // if (products.length > 0) throw new AppError('Cannot delete category with products', 400);

    return await categoryRepository.delete(id);
  }
}

export const categoryService = new CategoryService();
