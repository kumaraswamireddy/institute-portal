import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../../utils/ApiError';
import logger from '../../../utils/logger';

/**
 * Middleware to convert any non-ApiError into an ApiError instance.
 * This ensures a consistent error response format throughout the application.
 */
export const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    // Corrected: Cast statusCode to a key of httpStatus to resolve the implicit 'any' error.
    const message = error.message || httpStatus[statusCode as keyof typeof httpStatus];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

/**
 * The main error handling middleware.
 * It sends a standardized JSON error response to the client.
 */
export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message } = err;
  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = 'Internal Server Error';
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  if (process.env.NODE_ENV === 'development') {
    // Corrected: Pass the error stack or message to the logger, which expects a string.
    logger.error(err.stack || err.message);
  }

  res.status(statusCode).send(response);
};

