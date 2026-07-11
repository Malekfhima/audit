import { Request, Response, NextFunction } from 'express';

/**
 * Async handler wrapper for Express routes
 * Eliminates repetitive try-catch blocks in controllers
 */
type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
