import { Router } from 'express';
import { instituteController } from '../controllers/institute.controller';
import { validate } from '../middlewares/validator.middleware'; // Corrected: Renamed import
import { instituteValidator } from '../validators/institute.validator';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Public route to get all approved institutes
router.get('/', instituteController.getAllInstitutes);

// Public route to get a single institute's details
router.get('/:id', instituteController.getInstituteById);

// Protected route for an institute owner to create a new institute
// (Assuming the owner is already created via Google signup)
router.post(
  '/',
  protect,
  authorize('institute_owner'),
  validate(instituteValidator.createInstitute),
  instituteController.createInstitute
);

// Protected route for an institute owner to update their institute
router.put(
  '/:id',
  protect,
  authorize('institute_owner'),
  validate(instituteValidator.updateInstitute),
  instituteController.updateInstitute
);

export default router;
