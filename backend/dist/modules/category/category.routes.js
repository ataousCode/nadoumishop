"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("./category.controller");
const router = (0, express_1.Router)();
router.route("/").get(category_controller_1.getAllCategories).post(category_controller_1.createCategory);
router
    .route("/:id")
    .get(category_controller_1.getCategory)
    .patch(category_controller_1.updateCategory)
    .delete(category_controller_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=category.routes.js.map