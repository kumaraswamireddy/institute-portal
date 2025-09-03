import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { catchAsync } from '../../../utils/catchAsync';
import httpStatus from 'http-status';
import ApiResponse from '../../../utils/ApiResponse';
import ApiError from '../../../utils/ApiError';
import { pool } from '../../../config/database';

// Define an interface for the user payload attached by the auth middleware
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// ... (login, logout, refreshAccessToken functions remain the same) ...
const generateAdminToken = (id: string, role: string) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'JWT Secret is not configured.');
    }
    const expiresIn = '1d';
    return jwt.sign({ id, role }, secret, { expiresIn });
};
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
        name: user.usr_full_name,
        role: user.rol_role_name,
    };
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, { user: userResponse, token }, 'Admin login successful.'));
});
const logout = catchAsync(async (req: Request, res: Response) => {
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, {}, 'Logout successful.'));
});
const refreshAccessToken = catchAsync(async (req: Request, res: Response) => {
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, {}, 'Token refreshed.'));
});


/**
 * NEW: Gets the profile of the currently authenticated user based on their token.
 * This acts as our session validation endpoint.
 */
const getMe = catchAsync(async (req: AuthRequest, res: Response) => {
    const { id, role } = req.user!; // The protect middleware guarantees req.user exists
    
    let userResult;
    let user;

    switch (role) {
        case 'student':
            userResult = await pool.query('SELECT stu_student_id as id, stu_full_name as name, stu_email as email, stu_profile_picture_url as "profilePictureUrl" FROM students WHERE stu_student_id = $1', [id]);
            user = { ...userResult.rows[0], role: 'student' };
            break;
        case 'institute_owner':
            userResult = await pool.query('SELECT owner_id as id, owner_full_name as name, owner_email as email, owner_profile_picture_url as "profilePictureUrl" FROM institute_owners WHERE owner_id = $1', [id]);
            user = { ...userResult.rows[0], role: 'institute_owner' };
            break;
        case 'super_admin':
        case 'moderator':
            userResult = await pool.query('SELECT usr_user_id as id, usr_full_name as name, usr_email as email FROM users WHERE usr_user_id = $1', [id]);
            user = { ...userResult.rows[0], role };
            break;
        default:
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid user role found in token.');
    }

    if (userResult.rows.length === 0) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'User for this session no longer exists.');
    }

    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, user, 'User profile fetched successfully.'));
});

export const authController = {
  login,
  logout,
  refreshAccessToken,
  getMe, // Export the new controller
};

