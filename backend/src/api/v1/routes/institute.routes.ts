import { Router } from 'express';
import { instituteController } from '../controllers/institute.controller';
import { validatorMiddleware } from '../middlewares/validator.middleware';
import { createInstituteSchema, updateInstituteSchema } from '../validators/institute.validator';
import { instituteSearchSchema } from '../validators/search.validator';

const router = Router();

/**
 * Routes for /api/v1/institutes
 */
router
    .route('/')
    .post(validatorMiddleware(createInstituteSchema), instituteController.createInstitute)
    .get(validatorMiddleware(instituteSearchSchema), instituteController.getAllInstitutes);

router
    .route('/:instituteId')
    .get(instituteController.getInstituteById)
    .patch(validatorMiddleware(updateInstituteSchema), instituteController.updateInstitute)
    .delete(instituteController.deleteInstitute);

export default router;
