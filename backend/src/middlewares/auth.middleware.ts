import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { User } from "@prisma/client";
import { UserRepository } from "../modules/user/user.repository";
import { env } from "../config/env";

const userRepository = new UserRepository();

interface JwtPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401),
    );
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    const currentUser = await userRepository.findById(decoded.userId);

    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401,
        ),
      );
    }

    // Check if user changed password after the token was issued (Optional enhancement)

    (req as any).user = currentUser;
    next();
  } catch (error) {
    return next(new AppError("Invalid token or token expired", 401));
  }
};
