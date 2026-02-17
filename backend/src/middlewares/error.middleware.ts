import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";
import Logger from "../utils/logger";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

const handlePrismaError = (err: Prisma.PrismaClientKnownRequestError) => {
  switch (err.code) {
    case "P2002": // Unique constraint failed
      return new AppError("A record with this field already exists.", 409);
    case "P2025": // Record not found
      return new AppError("Record not found.", 404);
    default: {
      // Sanitize Prisma's technical details from the message
      const sanitizedMessage =
        err.message
          .split("\n")
          .filter(
            (line) =>
              line && !line.includes("prisma.") && !line.includes("invocation"),
          )
          .join(" ")
          .trim() || "Database error occurred";
      return new AppError(`Database Error: ${sanitizedMessage}`, 500);
    }
  }
};

const handleZodError = (err: ZodError) => {
  const issues = (err as any).errors || (err as any).issues;
  if (!issues) {
    return new AppError("Validation Error", 400);
  }
  const errors = issues.map((el: any) => `${el.path.join(".")}: ${el.message}`);
  const message = `Validation Error: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err: any, res: Response) => {
  Logger.error("ERROR 💥", err); // Log to file/console so we can see it
  const isOperational = err.isOperational;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // Only send technical details if it's NOT a standard operational error
    // or if the dev explicitly needs it (always sending it but structured)
    details: {
      error: !isOperational ? err : undefined,
      stack: !isOperational ? err.stack : undefined,
    },
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    Logger.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Log the raw error for debugging purposes
  console.error("🔥 GLOBAL ERROR HANDLER CAUGHT:", err);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // Handle specific error types
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    error = handlePrismaError(err);
  } else if (err instanceof ZodError) {
    error = handleZodError(err);
  } else if (err.name === "CastError") {
    error = handleCastErrorDB(err);
  } else if (err.name === "JsonWebTokenError") {
    error = handleJWTError();
  } else if (err.name === "TokenExpiredError") {
    error = handleJWTExpiredError();
  }

  if (env.NODE_ENV === "development") {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};
