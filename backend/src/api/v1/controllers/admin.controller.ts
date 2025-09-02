import { Request, Response, NextFunction } from 'express';
import { pool } from '../../../config/database';
import ApiResponse from '../../../utils/ApiResponse';
import ApiError from '../../../utils/ApiError';
import bcrypt from 'bcryptjs';

// ... existing getDashboardStats and getInstitutes functions ...

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const instituteCount = await pool.query("SELECT COUNT(*) FROM institutes");
        const studentCount = await pool.query("SELECT COUNT(*) FROM users WHERE usr_role = 'student'");
        
        const stats = {
            totalInstitutes: parseInt(instituteCount.rows[0].count, 10),
            totalStudents: parseInt(studentCount.rows[0].count, 10),
            // Add more stats as needed
        };
        
        res.status(200).json(new ApiResponse(200, stats, 'Dashboard statistics fetched successfully'));

    } catch (error) {
        next(error);
    }
};


export const getInstitutes = async (req: Request, res: Response, next: NextFunction) => {
     try {
        const { rows } = await pool.query(
            `SELECT inst_institute_id, inst_name, inst_city, inst_status, inst_created_at 
             FROM institutes ORDER BY inst_created_at DESC`
        );
        
        res.status(200).json(new ApiResponse(200, rows, 'Institutes fetched successfully'));

    } catch (error) {
        next(error);
    }
};


// ===============================================
// STUDENT MANAGEMENT
// ===============================================

export const getAllStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { rows } = await pool.query(
            `SELECT usr_user_id, usr_full_name, usr_email, usr_created_at, usr_last_login 
             FROM users 
             WHERE usr_role = 'student' ORDER BY usr_created_at DESC`
        );
        res.status(200).json(new ApiResponse(200, rows, 'Students fetched successfully'));
    } catch (error) {
        next(error);
    }
};

// ===============================================
// ADMIN USER MANAGEMENT
// ===============================================

export const createAdminUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, full_name, role_id } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        
        const { rows } = await pool.query(
            `INSERT INTO users (usr_email, usr_password_hash, usr_full_name, usr_role_id, usr_role) 
             VALUES ($1, $2, $3, $4, 'platform_admin') RETURNING usr_user_id, usr_email, usr_full_name, usr_created_at`,
            [email, password_hash, full_name, role_id]
        );
        res.status(201).json(new ApiResponse(201, rows[0], 'Admin user created successfully'));
    } catch (error: any) {
        if (error.code === '23505') { // Unique violation
            return next(new ApiError(409, 'User with this email already exists'));
        }
        next(error);
    }
};

export const getAllAdminUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { rows } = await pool.query(
            `SELECT u.usr_user_id, u.usr_full_name, u.usr_email, r.rol_role_name 
             FROM users u
             LEFT JOIN roles r ON u.usr_role_id = r.rol_role_id
             WHERE u.usr_role = 'platform_admin' ORDER BY u.usr_created_at DESC`
        );
        res.status(200).json(new ApiResponse(200, rows, 'Admin users fetched successfully'));
    } catch (error) {
        next(error);
    }
};

export const getAdminUserById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query(
            `SELECT usr_user_id, usr_full_name, usr_email, usr_role_id FROM users WHERE usr_user_id = $1 AND usr_role = 'platform_admin'`,
            [id]
        );
        if (rows.length === 0) {
            return next(new ApiError(404, 'Admin user not found'));
        }
        res.status(200).json(new ApiResponse(200, rows[0]));
    } catch (error) {
        next(error);
    }
};

export const updateAdminUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { full_name, role_id } = req.body;
    try {
        const { rows } = await pool.query(
            `UPDATE users SET usr_full_name = $1, usr_role_id = $2 
             WHERE usr_user_id = $3 AND usr_role = 'platform_admin'
             RETURNING usr_user_id, usr_full_name, usr_email, usr_role_id`,
            [full_name, role_id, id]
        );
        if (rows.length === 0) {
            return next(new ApiError(404, 'Admin user not found'));
        }
        res.status(200).json(new ApiResponse(200, rows[0], 'Admin user updated successfully'));
    } catch (error) {
        next(error);
    }
};

export const deleteAdminUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const { rowCount } = await pool.query(
            `DELETE FROM users WHERE usr_user_id = $1 AND usr_role = 'platform_admin'`, [id]
        );
        if (rowCount === 0) {
            return next(new ApiError(404, 'Admin user not found'));
        }
        res.status(200).json(new ApiResponse(200, null, 'Admin user deleted successfully'));
    } catch (error) {
        next(error);
    }
};


// ===============================================
// ROLE MANAGEMENT
// ===============================================

export const createRole = async (req: Request, res: Response, next: NextFunction) => {
    const { role_name } = req.body;
    try {
        const { rows } = await pool.query(
            'INSERT INTO roles (rol_role_name) VALUES ($1) RETURNING *', [role_name]
        );
        res.status(201).json(new ApiResponse(201, rows[0], 'Role created successfully'));
    } catch (error: any) {
        if (error.code === '23505') {
            return next(new ApiError(409, 'Role with this name already exists'));
        }
        next(error);
    }
};

export const getAllRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { rows } = await pool.query('SELECT * FROM roles ORDER BY rol_role_name');
        res.status(200).json(new ApiResponse(200, rows, 'Roles fetched successfully'));
    } catch (error) {
        next(error);
    }
};

export const getRoleById = async (req: Request, res: Response, next: NextFunction) => {
    // This could be expanded to also return associated permissions
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM roles WHERE rol_role_id = $1', [id]);
        if (rows.length === 0) {
            return next(new ApiError(404, 'Role not found'));
        }
        res.status(200).json(new ApiResponse(200, rows[0]));
    } catch (error) {
        next(error);
    }
};

export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { role_name } = req.body;
    try {
        const { rows } = await pool.query(
            'UPDATE roles SET rol_role_name = $1 WHERE rol_role_id = $2 RETURNING *',
            [role_name, id]
        );
         if (rows.length === 0) {
            return next(new ApiError(404, 'Role not found'));
        }
        res.status(200).json(new ApiResponse(200, rows[0], 'Role updated successfully'));
    } catch (error) {
        next(error);
    }
};

export const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
         const { rowCount } = await pool.query('DELETE FROM roles WHERE rol_role_id = $1', [id]);
        if (rowCount === 0) {
            return next(new ApiError(404, 'Role not found'));
        }
        res.status(200).json(new ApiResponse(200, null, 'Role deleted successfully'));
    } catch (error) {
        next(error);
    }
};

