"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("./user.repository");
const AppError_1 = require("../../utils/AppError");
const userRepository = new user_repository_1.UserRepository();
class UserService {
    async getMe(userId) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new AppError_1.AppError("User not found", 404);
        }
        return user;
    }
    async updateMe(userId, dto) {
        const user = await userRepository.update(userId, dto);
        return user;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map