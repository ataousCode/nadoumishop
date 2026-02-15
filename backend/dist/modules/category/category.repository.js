"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRepository = exports.CategoryRepository = void 0;
const prisma_1 = require("../../config/prisma");
class CategoryRepository {
    async create(data) {
        return prisma_1.prisma.category.create({
            data,
        });
    }
    async findAll() {
        return prisma_1.prisma.category.findMany({
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
    async findById(id) {
        return prisma_1.prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });
    }
    async findByName(name) {
        return prisma_1.prisma.category.findUnique({
            where: { name },
        });
    }
    async update(id, data) {
        return prisma_1.prisma.category.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return prisma_1.prisma.category.delete({
            where: { id },
        });
    }
}
exports.CategoryRepository = CategoryRepository;
exports.categoryRepository = new CategoryRepository();
//# sourceMappingURL=category.repository.js.map