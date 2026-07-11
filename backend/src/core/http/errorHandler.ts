import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import logger from "../utils/logger";
import config from "../../config/config";
import { HttpError, NotFoundError } from "./httpError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error("Unhandled error", {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userId: (req as any).user?._id,
  });

  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: any[] | undefined;

  if (err instanceof HttpError && err.isOperational) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 422;
    message = "Validation error";
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Mongoose cast error
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate field value";
    errors = Object.keys(err.keyValue).map((key) => ({
      field: key,
      message: "Value already exists",
    }));
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  const response: any = {
    success: false,
    statusCode,
    message,
  };

  if (errors) response.errors = errors;

  if (config.server.nodeEnv === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new NotFoundError("Route not found"));
};
