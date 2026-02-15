"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategory = exports.getAllCategories = exports.createCategory = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const category_service_1 = require("./category.service");
const create_category_dto_1 = require("./dto/create-category.dto");
const update_category_dto_1 = require("./dto/update-category.dto");
exports.createCategory = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const result = create_category_dto_1.createCategorySchema.parse(req.body);
    const category = await category_service_1.categoryService.createCategory(result.body);
    res.status(201).json({
        status: "success",
        data: {
            category,
        },
    });
});
exports.getAllCategories = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const categories = await category_service_1.categoryService.getAllCategories();
    res.status(200).json({
        status: "success",
        results: categories.length,
        data: {
            categories,
        },
    });
});
exports.getCategory = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const category = await category_service_1.categoryService.getCategoryById(req.params.id);
    res.status(200).json({
        status: "success",
        data: {
            category,
        },
    });
});
exports.updateCategory = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const result = update_category_dto_1.updateCategorySchema.parse(req.body);
    const category = await category_service_1.categoryService.updateCategory(req.params.id, result.body);
    res.status(200).json({
        status: "success",
        data: {
            category,
        },
    });
});
exports.deleteCategory = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    await category_service_1.categoryService.deleteCategory(req.params.id);
    res.status(204).json({
        status: "success",
        data: null,
    });
});
//# sourceMappingURL=category.controller.js.map