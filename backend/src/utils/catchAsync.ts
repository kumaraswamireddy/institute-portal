import { Request, Response, NextFunction } from 'express';

// Define the type for an async Express route handler
type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

/**
 * Wraps an asynchronous route handler to catch any errors and pass them to the Express error-handling middleware.
 * @param fn The asynchronous function to wrap.
 * @returns A standard Express route handler.
 */
export const catchAsync = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
