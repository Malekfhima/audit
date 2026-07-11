import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../../config/config";
import { UnauthorizedError } from "../http/httpError";
import asyncHandler from "../http/asyncHandler";
import { User } from "../../modules/users/user.model";

/* =====================
   Extend Express Request
===================== */
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

interface JwtPayload {
  userId: string;
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}

/* =====================
   Authenticate Middleware
===================== */
export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const decoded = jwt.verify(
      token,
      config.jwt.jwtSecret
    ) as JwtPayload;

    const user = await User.findById(decoded.userId).select(
      "-password"
    );

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    req.user = user;
    next();
  }
);

/* =====================
   Optional Authentication
===================== */
export const optionalAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) return next();

    try {
      const decoded = jwt.verify(
        token,
        config.jwt.jwtSecret
      ) as JwtPayload;

      const user = await User.findById(decoded.userId).select(
        "-password"
      );

      if (user) req.user = user;
    } catch (error) {
      // Ignore invalid token
    }

    next();
  }
);

export default authenticate;
