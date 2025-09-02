import { Request, Response, NextFunction } from 'express';
import ApiError from '../../../utils/ApiError';
import logger from '../../../utils/logger';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = err;

    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Something went wrong';
        error = new ApiError(statusCode, message, false, err.stack);
    }
    
    logger.error(error.message, { stack: error.stack });

    const response = {
        success: false,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    };

    res.status(error.statusCode).json(response);
};

