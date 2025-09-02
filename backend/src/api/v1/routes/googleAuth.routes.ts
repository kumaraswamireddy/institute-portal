import { Router } from 'express';
import { googleAuthController } from '../controllers/googleAuth.controller';
import { validate } from '../middlewares/validator.middleware';
import { authValidator } from '../validators/auth.validator'; // This validator will also need to be updated.

const router = Router();

router.post(
    '/google-sign-in',
    validate(authValidator.googleSignIn),
    googleAuthController.googleSignIn
);

router.post(
    '/register',
    validate(authValidator.register),
    googleAuthController.register
);

export const googleAuthRoutes = router;
