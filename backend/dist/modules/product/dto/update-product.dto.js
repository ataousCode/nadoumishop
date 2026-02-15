"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = void 0;
const zod_1 = require("zod");
exports.updateProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        description: zod_1.z.string().min(1).optional(),
        price: zod_1.z.number().min(0).optional(),
        stock: zod_1.z.number().int().min(0).optional(),
        images: zod_1.z.array(zod_1.z.string().url()).min(1).optional(),
        categoryId: zod_1.z.string().uuid().optional(),
    }),
});
//# sourceMappingURL=update-product.dto.js.map