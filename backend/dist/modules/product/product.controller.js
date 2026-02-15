"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.getAllProducts = exports.createProduct = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const product_service_1 = require("./product.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const query_product_dto_1 = require("./dto/query-product.dto");
exports.createProduct = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const result = create_product_dto_1.createProductSchema.parse(req.body);
    const product = await product_service_1.productService.createProduct(result.body);
    res.status(201).json({
        status: "success",
        data: {
            product,
        },
    });
});
exports.getAllProducts = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const query = query_product_dto_1.queryProductSchema.parse({ query: req.query }).query;
    const result = await product_service_1.productService.getAllProducts(query);
    res.status(200).json({
        status: "success",
        results: result.products.length,
        data: result,
    });
});
exports.getProduct = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const product = await product_service_1.productService.getProductById(req.params.id);
    res.status(200).json({
        status: "success",
        data: {
            product,
        },
    });
});
exports.updateProduct = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const result = update_product_dto_1.updateProductSchema.parse(req.body);
    const product = await product_service_1.productService.updateProduct(req.params.id, result.body);
    res.status(200).json({
        status: "success",
        data: {
            product,
        },
    });
});
exports.deleteProduct = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    await product_service_1.productService.deleteProduct(req.params.id);
    res.status(204).json({
        status: "success",
        data: null,
    });
});
//# sourceMappingURL=product.controller.js.map