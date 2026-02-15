"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRepository = exports.ProductRepository = void 0;
const prisma_1 = require("../../config/prisma");
class ProductRepository {
    async create(data) {
        return prisma_1.prisma.product.create({
            data,
        });
    }
    async findAll(query) {
        const { category, minPrice, maxPrice, search, page = 1, limit = 10, } = query;
        // Explicitly type 'where' to match Prisma's expected input
        const where = {};
        if (category) {
            const categoryRecord = await prisma_1.prisma.category.findUnique({
                where: { name: category },
            });
            if (categoryRecord) {
                where.categoryId = categoryRecord.id;
            }
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined)
                where.price.gte = minPrice;
            if (maxPrice !== undefined)
                where.price.lte = maxPrice;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }
        const skip = (page - 1) * limit;
        const [products, total] = await Promise.all([
            prisma_1.prisma.product.findMany({
                where,
                include: { category: true },
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma_1.prisma.product.count({ where }),
        ]);
        return {
            products,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findById(id) {
        return prisma_1.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                reviews: true,
            },
        });
    }
    async update(id, data) {
        return prisma_1.prisma.product.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return prisma_1.prisma.product.delete({
            where: { id },
        });
    }
}
exports.ProductRepository = ProductRepository;
exports.productRepository = new ProductRepository();
//# sourceMappingURL=product.repository.js.map