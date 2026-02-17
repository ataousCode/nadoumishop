import { Request, Response, NextFunction } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";

export class UserController {
  getMe = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user!.id;
      const user = await userService.getMe(userId);
      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    },
  );

  updateMe = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user!.id;
      const updateData = { ...req.body };

      // Prevent garbage profilePicture from req.body overriding the file upload logic
      // or causing Prisma errors if it's an object/undefined
      delete updateData.profilePicture;

      if (req.file) {
        updateData.profilePicture = `/images/products/${req.file.filename}`;
      }

      const user = await userService.updateMe(userId, updateData);
      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    },
  );

  updatePassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user!.id;
      await userService.updatePassword(userId, req.body);
      res.status(200).json({
        status: "success",
        message: "Password updated successfully",
      });
    },
  );

  getAllUsers = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const users = await userService.getAllUsers();
      res.status(200).json({
        status: "success",
        data: {
          users,
        },
      });
    },
  );

  updateUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await userService.updateUser(
        req.params.id as string,
        req.body,
      );
      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    },
  );

  createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body);
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  });

  deleteUser = catchAsync(async (req: Request, res: Response) => {
    await userService.deleteUser(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

  toggleBlockStatus = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.toggleBlockStatus(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
      message: user.isBlocked ? "User blocked" : "User unblocked",
    });
  });
}

export const userController = new UserController();
