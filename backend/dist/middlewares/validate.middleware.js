"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const AppError_1 = require("../utils/AppError");
const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (error) {
        // Check if it's a ZodError
        if (error.errors) {
            const errorMessage = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join(", ");
            return next(new AppError_1.AppError(errorMessage, 400));
        }
        next(error);
    }
};
exports.validate = validate;
//# sourceMappingURL=validate.middleware.js.map