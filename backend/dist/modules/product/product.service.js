"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = exports.ProductService = void 0;
const prisma_1 = require("../../config/prisma");
const AppError_1 = require("../../utils/AppError");
const product_repository_1 = require("./product.repository");
class ProductService {
    async createProduct(input) {
        const category = await prisma_1.prisma.category.findUnique({
            where: { id: input.categoryId },
        });
        if (!category) {
            throw new AppError_1.AppError("Category not found", 404);
        }
        return await product_repository_1.productRepository.create(input);
    }
    async getAllProducts(query) {
        return await product_repository_1.productRepository.findAll(query);
    }
    async getProductById(id) {
        const product = await product_repository_1.productRepository.findById(id);
        if (!product) {
            throw new AppError_1.AppError("Product not found", 404);
        }
        return product;
    }
    async updateProduct(id, input) {
        const product = await product_repository_1.productRepository.findById(id);
        if (!product) {
            throw new AppError_1.AppError("Product not found", 404);
        }
        if (input.categoryId) {
            const category = await prisma_1.prisma.category.findUnique({
                where: { id: input.categoryId },
            });
            if (!category) {
                throw new AppError_1.AppError("Category not found", 404);
            }
        }
        return await product_repository_1.productRepository.update(id, input);
    }
    async deleteProduct(id) {
        const product = await product_repository_1.productRepository.findById(id);
        if (!product) {
            throw new AppError_1.AppError("Product not found", 404);
        }
        await product_repository_1.productRepository.delete(id);
    }
}
exports.ProductService = ProductService;
exports.productService = new ProductService();
//# sourceMappingURL=product.service.js.map