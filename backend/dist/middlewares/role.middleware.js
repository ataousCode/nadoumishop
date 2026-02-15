"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = exports.restrictTo = void 0;
const AppError_1 = require("../utils/AppError");
const restrictTo = (...roles) => {
    return (req, res, next) => {
        // @ts-ignore
        if (!roles.includes(req.user.role)) {
            return next(new AppError_1.AppError("You do not have permission to perform this action", 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
// Also exporting as roleMiddleware for clarity if needed, but restrictTo is standard
exports.roleMiddleware = exports.restrictTo;
//# sourceMappingURL=role.middleware.js.map