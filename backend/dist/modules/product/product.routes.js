"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const router = (0, express_1.Router)();
router.route("/").get(product_controller_1.getAllProducts).post(product_controller_1.createProduct);
router.route("/:id").get(product_controller_1.getProduct).patch(product_controller_1.updateProduct).delete(product_controller_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=product.routes.js.map