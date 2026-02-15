"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Product name is required"),
        description: zod_1.z.string().min(1, "Description is required"),
        price: zod_1.z.number().min(0, "Price must be greater than or equal to 0"),
        stock: zod_1.z.number().int().min(0, "Stock must be greater than or equal to 0"),
        images: zod_1.z.array(zod_1.z.string().url()).min(1, "At least one image is required"),
        categoryId: zod_1.z.string().uuid("Invalid category ID"),
    }),
});
//# sourceMappingURL=create-product.dto.js.map