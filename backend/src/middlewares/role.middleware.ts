import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );
    }
    next();
  };
};

// Also exporting as roleMiddleware for clarity if needed, but restrictTo is standard
export const roleMiddleware = restrictTo;
