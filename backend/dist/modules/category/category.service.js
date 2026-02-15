"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = exports.CategoryService = void 0;
const AppError_1 = require("../../utils/AppError");
const category_repository_1 = require("./category.repository");
class CategoryService {
    async createCategory(input) {
        const existingCategory = await category_repository_1.categoryRepository.findByName(input.name);
        if (existingCategory) {
            throw new AppError_1.AppError("Category with this name already exists", 400);
        }
        return await category_repository_1.categoryRepository.create(input);
    }
    async getAllCategories() {
        return await category_repository_1.categoryRepository.findAll();
    }
    async getCategoryById(id) {
        const category = await category_repository_1.categoryRepository.findById(id);
        if (!category) {
            throw new AppError_1.AppError("Category not found", 404);
        }
        return category;
    }
    async updateCategory(id, input) {
        const category = await category_repository_1.categoryRepository.findById(id);
        if (!category) {
            throw new AppError_1.AppError("Category not found", 404);
        }
        if (input.name) {
            const existingCategory = await category_repository_1.categoryRepository.findByName(input.name);
            if (existingCategory && existingCategory.id !== id) {
                throw new AppError_1.AppError("Category with this name already exists", 400);
            }
        }
        return await category_repository_1.categoryRepository.update(id, input);
    }
    async deleteCategory(id) {
        const category = await category_repository_1.categoryRepository.findById(id);
        if (!category) {
            throw new AppError_1.AppError("Category not found", 404);
        }
        // Optional: Check if category has products before deleting
        // const products = await productRepository.findByCategoryId(id);
        // if (products.length > 0) throw new AppError('Cannot delete category with products', 400);
        return await category_repository_1.categoryRepository.delete(id);
    }
}
exports.CategoryService = CategoryService;
exports.categoryService = new CategoryService();
//# sourceMappingURL=category.service.js.map