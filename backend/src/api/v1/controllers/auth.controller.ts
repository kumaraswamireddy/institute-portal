import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { catchAsync } from '../../../utils/catchAsync';
import httpStatus from 'http-status';
import ApiResponse from '../../../utils/ApiResponse'; // Corrected: Use default import
import ApiError from '../../../utils/ApiError'; // Corrected: Use default import
import { pool } from '../../../config/database';

/**
 * Generates a JWT for an authenticated admin user.
 * @param id The admin user's ID.
 * @param role The admin user's role.
 * @returns An application-specific JWT.
 */
const generateAdminToken = (id: string, role: string) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'JWT Secret is not configured.');
    }
    const expiresIn = '1d'; // Admin token expires in 1 day
    return jwt.sign({ id, role }, secret, { expiresIn });
};

/**
 * Handles the login for platform admins/staff via email and password.
 */
const login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userResult = await pool.query(
        `SELECT u.usr_user_id, u.usr_email, u.usr_password_hash, r.rol_role_name 
         FROM users u
         LEFT JOIN roles r ON u.usr_role_id = r.rol_role_id
         WHERE u.usr_email = $1`,
        [email]
    );

    const user = userResult.rows[0];

    if (!user || !(await bcrypt.compare(password, user.usr_password_hash))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
    }

    const token = generateAdminToken(user.usr_user_id, user.rol_role_name);

    const userResponse = {
        id: user.usr_user_id,
        email: user.usr_email,
        role: user.rol_role_name,
    };
    
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, { user: userResponse, token }, 'Admin login successful.'));
});

// Placeholder for admin logout logic
const logout = catchAsync(async (req: Request, res: Response) => {
    // TODO: Implement token invalidation/logout logic here if needed (e.g., blocklisting tokens)
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, {}, 'Logout successful.'));
});

// Placeholder for admin token refresh logic
const refreshAccessToken = catchAsync(async (req: Request, res: Response) => {
    // TODO: Implement refresh token logic for admins
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, {}, 'Token refreshed.'));
});


export const authController = {
  login,
  logout,
  refreshAccessToken,
};

