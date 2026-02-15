"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const userService = new user_service_1.UserService();
class UserController {
    getMe = async (req, res, next) => {
        try {
            // Assuming req.user is populated by auth middleware
            const userId = req.user.userId;
            const user = await userService.getMe(userId);
            res.status(200).json({
                status: "success",
                data: {
                    user,
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
    updateMe = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const user = await userService.updateMe(userId, req.body);
            res.status(200).json({
                status: "success",
                data: {
                    user,
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map