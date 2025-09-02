import { body } from 'express-validator';

export const createRoleValidator = [
    body('role_name').notEmpty().isString().withMessage('Role name is required'),
];

export const updateRoleValidator = [
    body('role_name').notEmpty().isString().withMessage('Role name is required'),
];
