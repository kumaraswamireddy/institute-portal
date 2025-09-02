import { body } from 'express-validator';

export const createCourseValidator = [
    body('title').notEmpty().withMessage('Course title is required'),
    body('description').notEmpty().withMessage('Course description is required'),
    body('mrp_fee').isDecimal().withMessage('MRP Fee must be a valid decimal number'),
    body('offer_fee').optional().isDecimal().withMessage('Offer Fee must be a valid decimal number'),
];
