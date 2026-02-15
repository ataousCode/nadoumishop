"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../utils/AppError");
const user_repository_1 = require("../modules/user/user.repository");
const userRepository = new user_repository_1.UserRepository();
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new AppError_1.AppError("You are not logged in! Please log in to get access.", 401));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const currentUser = await userRepository.findById(decoded.userId);
        if (!currentUser) {
            return next(new AppError_1.AppError("The user belonging to this token does no longer exist.", 401));
        }
        // Check if user changed password after the token was issued (Optional enhancement)
        req.user = currentUser;
        next();
    }
    catch (error) {
        return next(new AppError_1.AppError("Invalid token or token expired", 401));
    }
};
exports.protect = protect;
//# sourceMappingURL=auth.middleware.js.map