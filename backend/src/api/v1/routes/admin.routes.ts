import { Router } from 'express';
import { protect, authorize } from '../middlewares/auth.middleware';
import { 
    getDashboardStats, 
    getInstitutes,
    getAllAdminUsers,
    createAdminUser,
    getAdminUserById,
    updateAdminUser,
    deleteAdminUser,
    getAllRoles,
    createRole,
    getRoleById,
    updateRole,
    deleteRole,
    getAllStudents
} from '../controllers/admin.controller';
import { validate } from '../middlewares/validator.middleware';
import { createUserValidator, updateUserValidator } from '../validators/user.validator';
import { createRoleValidator, updateRoleValidator } from '../validators/role.validator';

const router = Router();

// All routes below are protected
router.use(protect);

// Dashboard (accessible to all admin types)
router.get('/dashboard', authorize('super_admin', 'manager', 'viewer'), getDashboardStats);

// Institute Management (accessible to managers and super admins)
router.get('/institutes', authorize('super_admin', 'manager'), getInstitutes);

// Student Management
router.get('/students', authorize('super_admin', 'manager'), getAllStudents);

// User Management (only for super admins)
router.route('/users')
    .get(authorize('super_admin'), getAllAdminUsers)
    .post(authorize('super_admin'), createUserValidator, validate, createAdminUser);

router.route('/users/:id')
    .get(authorize('super_admin'), getAdminUserById)
    .put(authorize('super_admin'), updateUserValidator, validate, updateAdminUser)
    .delete(authorize('super_admin'), deleteAdminUser);

// Role & Permission Management (only for super admins)
router.route('/roles')
    .get(authorize('super_admin'), getAllRoles)
    .post(authorize('super_admin'), createRoleValidator, validate, createRole);

router.route('/roles/:id')
    .get(authorize('super_admin'), getRoleById)
    .put(authorize('super_admin'), updateRoleValidator, validate, updateRole)
    .delete(authorize('super_admin'), deleteRole);


export default router;

