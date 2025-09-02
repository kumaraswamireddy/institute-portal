import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ApiError from '../../../utils/ApiError';
import httpStatus from 'http-status';
import { pool } from '../../../config/database';
import { catchAsync } from '../../../utils/catchAsync';

// Extend the Express Request type to include our user payload
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    [key: string]: any;
  };
}

/**
 * Middleware to protect routes by verifying a JWT.
 * It checks for a valid token and attaches the user payload to the request object.
 */
export const protect = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not logged in. Please log in to get access.');
    }
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'JWT Secret is not configured.');
    }

    const decoded = jwt.verify(token, secret) as { id: string; role: string; iat: number; exp: number };
    
    let userResult;
    // Check different tables based on the role encoded in the token
    switch (decoded.role) {
        case 'student':
            userResult = await pool.query('SELECT stu_student_id as id FROM students WHERE stu_student_id = $1', [decoded.id]);
            break;
        case 'institute_owner':
            userResult = await pool.query('SELECT owner_id as id FROM institute_owners WHERE owner_id = $1', [decoded.id]);
            break;
        case 'super_admin':
        case 'moderator':
            userResult = await pool.query('SELECT usr_user_id as id FROM users WHERE usr_user_id = $1', [decoded.id]);
            break;
        default:
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid user role in token.');
    }

    if (userResult.rows.length === 0) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'The user belonging to this token does no longer exist.');
    }
    
    // Attach user payload to the request for subsequent middleware/controllers
    req.user = { id: decoded.id, role: decoded.role };
    next();
});

/**
 * Middleware factory to authorize users based on their role.
 * Should be used after the `protect` middleware.
 * @param {...string} roles - A list of roles that are allowed to access the route.
 */
export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to perform this action.');
        }
        next();
    };
};

/**
 * A general-purpose auth middleware for simple authentication checks if needed.
 * In this new structure, `protect` is more specific and should be preferred.
 */
export const authMiddleware = protect;

