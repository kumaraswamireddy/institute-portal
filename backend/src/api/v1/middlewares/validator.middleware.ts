import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError, ZodIssue } from 'zod';
import ApiError from '../../../utils/ApiError'; // Corrected: Use default import
import httpStatus from 'http-status';

/**
 * This is a middleware factory.
 * It takes a Zod schema and returns an Express middleware function.
 * @param schema The Zod schema to validate against the request.
 * @returns An Express middleware function.
 */
export const validate =
  // Corrected: Provided 2 generic arguments instead of 3 to match the library version.
  (schema: ZodObject<any, any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Corrected for modern Zod: use 'issues' instead of 'errors' and add explicit types
        const errorMessage = error.issues.map((issue: ZodIssue) => issue.message).join(', ');
        return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
      }
      return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error during validation.'));
    }
  };

