"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryProductSchema = void 0;
const zod_1 = require("zod");
exports.queryProductSchema = zod_1.z.object({
    query: zod_1.z.object({
        category: zod_1.z.string().optional(),
        minPrice: zod_1.z.coerce.number().min(0).optional(),
        maxPrice: zod_1.z.coerce.number().min(0).optional(),
        search: zod_1.z.string().optional(),
        page: zod_1.z.coerce.number().int().min(1).default(1),
        limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
    }),
});
//# sourceMappingURL=query-product.dto.js.map