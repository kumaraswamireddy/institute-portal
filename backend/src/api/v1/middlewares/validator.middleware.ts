import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import ApiError from '../../../utils/ApiError';

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors: { [key: string]: string }[] = [];
    errors.array().map(err => extractedErrors.push({ [err.type === 'field' ? err.path : '']: err.msg }));

    return next(new ApiError(422, 'Validation failed', true, JSON.stringify(extractedErrors)));
};
