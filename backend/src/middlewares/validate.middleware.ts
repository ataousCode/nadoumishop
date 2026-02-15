import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../utils/AppError";

export const validate =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      // Check if it's a ZodError
      if (error.errors) {
        const errorMessage = error.errors
          .map((err: any) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
        return next(new AppError(errorMessage, 400));
      }
      next(error);
    }
  };
