import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";

const userService = new UserService();

export class UserController {
  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Assuming req.user is populated by auth middleware
      const userId = (req as any).user.id;
      const user = await userService.getMe(userId);
      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  updateMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const user = await userService.updateMe(userId, req.body);
      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
