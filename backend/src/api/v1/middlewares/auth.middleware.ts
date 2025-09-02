import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../../../config/database';
import ApiError from '../../../utils/ApiError';

interface DecodedToken {
    id: string;
}

// Augment the Express Request type to include the user property
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
            };
        }
    }
}

// The 'export' keyword MUST be here
export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

            const userResult = await pool.query(
                `SELECT u.usr_user_id, r.rol_role_name 
                 FROM users u 
                 LEFT JOIN roles r ON u.usr_role_id = r.rol_role_id
                 WHERE u.usr_user_id = $1`,
                [decoded.id]
            );

            if (userResult.rows.length === 0) {
                return next(new ApiError(401, 'Not authorized, user not found'));
            }

            req.user = {
                id: userResult.rows[0].usr_user_id,
                role: userResult.rows[0].rol_role_name,
            };

            next();
        } catch (error) {
            return next(new ApiError(401, 'Not authorized, token failed'));
        }
    }

    if (!token) {
        return next(new ApiError(401, 'Not authorized, no token'));
    }
};

// The 'export' keyword MUST be here as well
export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new ApiError(403, `User role '${req.user?.role}' is not authorized to access this route`));
        }
        next();
    };
};

