import { body } from 'express-validator';

export const createUserValidator = [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('full_name').notEmpty().withMessage('Full name is required'),
    body('role_id').isUUID().withMessage('A valid role ID is required'),
];

export const updateUserValidator = [
    body('full_name').notEmpty().withMessage('Full name is required'),
    body('role_id').isUUID().withMessage('A valid role ID is required'),
];
