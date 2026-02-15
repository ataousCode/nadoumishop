"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = void 0;
const zod_1 = require("zod");
exports.updateCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Category name is required").optional(),
    }),
});
//# sourceMappingURL=update-category.dto.js.map