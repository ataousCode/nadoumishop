import { Request, Response, NextFunction } from "express";
import { AdminService } from "./admin.service";

const adminService = new AdminService();

export class AdminController {
  getDashboardStats = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const stats = await adminService.getDashboardStats();
      res.status(200).json({
        status: "success",
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  };
}
