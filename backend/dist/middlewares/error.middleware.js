"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError_1.AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError_1.AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new AppError_1.AppError(message, 400);
};
const handleJWTError = () => new AppError_1.AppError("Invalid token. Please log in again!", 401);
const handleJWTExpiredError = () => new AppError_1.AppError("Your token has expired! Please log in again.", 401);
const handlePrismaError = (err) => {
    switch (err.code) {
        case "P2002": // Unique constraint failed
            return new AppError_1.AppError("A record with this field already exists.", 409);
        case "P2025": // Record not found
            return new AppError_1.AppError("Record not found.", 404);
        default:
            return new AppError_1.AppError(`Database Error: ${err.message}`, 500);
    }
};
const handleZodError = (err) => {
    const errors = err.errors.map((el) => `${el.path.join(".")}: ${el.message}`);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new AppError_1.AppError(message, 400);
};
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    else {
        // Programming or other unknown error: don't leak error details
        logger_1.Logger.error("ERROR 💥", err);
        res.status(500).json({
            status: "error",
            message: "Something went very wrong!",
        });
    }
};
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    let error = { ...err };
    error.message = err.message;
    error.stack = err.stack; // Preserve stack for dev
    // Handle specific error types
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        error = handlePrismaError(err);
    }
    else if (err instanceof zod_1.ZodError) {
        error = handleZodError(err);
    }
    else if (error.name === "CastError") {
        error = handleCastErrorDB(error);
    }
    else if (error.code === 11000) {
        error = handleDuplicateFieldsDB(error);
    }
    else if (error.name === "ValidationError") {
        error = handleValidationErrorDB(error);
    }
    else if (error.name === "JsonWebTokenError") {
        error = handleJWTError();
    }
    else if (error.name === "TokenExpiredError") {
        error = handleJWTExpiredError();
    }
    // Ensure status code is set if it was lost during transformation
    if (!error.statusCode)
        error.statusCode = err.statusCode || 500;
    if (!error.status)
        error.status = err.status || "error";
    if (env_1.env.NODE_ENV === "development") {
        sendErrorDev(error, res);
    }
    else {
        sendErrorProd(error, res);
    }
};
exports.globalErrorHandler = globalErrorHandler;
//# sourceMappingURL=error.middleware.js.map