import { Request, Response, NextFunction } from 'express';
import { pool } from '../../../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ApiError from '../../../utils/ApiError';
import ApiResponse from '../../../utils/ApiResponse';

// Helper function to generate JWT
const generateToken = (id: string, role: string) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new ApiError(500, 'JWT Secret not configured');
    }

    // FINAL FIX:
    // We will use a number (seconds) for the expiration time to satisfy the strict
    // type checking of the jsonwebtoken library. This is the most robust solution.
    // The value here is for 30 days.
    const expiresIn = 30 * 24 * 60 * 60; 

    return jwt.sign({ id, role }, secret, {
        expiresIn: expiresIn,
    });
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
        const userResult = await pool.query(
            `SELECT u.*, r.rol_role_name 
             FROM users u
             LEFT JOIN roles r ON u.usr_role_id = r.rol_role_id
             WHERE u.usr_email = $1`,
            [email]
        );

        const user = userResult.rows[0];

        if (!user || !(await bcrypt.compare(password, user.usr_password_hash))) {
            return next(new ApiError(401, 'Invalid email or password'));
        }
        
        const token = generateToken(user.usr_user_id, user.rol_role_name);

        res.status(200).json(new ApiResponse(200, {
            token,
            user: {
                id: user.usr_user_id,
                name: user.usr_full_name,
                email: user.usr_email,
                role: user.rol_role_name
            }
        }, 'Login successful'));

    } catch (error) {
        next(error);
    }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) {
            return next(new ApiError(401, 'Not authenticated'));
        }
        
        const userResult = await pool.query(
            `SELECT u.usr_user_id AS id, u.usr_full_name AS name, u.usr_email AS email, r.rol_role_name AS role
             FROM users u
             LEFT JOIN roles r ON u.usr_role_id = r.rol_role_id
             WHERE u.usr_user_id = $1`,
            [req.user.id] 
        );

        if (userResult.rows.length === 0) {
            return next(new ApiError(404, 'User not found'));
        }

        res.status(200).json(new ApiResponse(200, userResult.rows[0], 'User data fetched successfully'));

    } catch (error) {
        next(error);
    }
};

