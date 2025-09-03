import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { googleAuthController } from '../controllers/googleAuth.controller';
import { validate } from '../middlewares/validator.middleware';
import { authValidator } from '../validators/auth.validator';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// ... (existing routes remain the same) ...
router.post('/login', validate(authValidator.login), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', protect, authController.refreshAccessToken);
router.post('/google/signin', validate(authValidator.googleSignIn), googleAuthController.googleSignIn);
router.post('/google/register', validate(authValidator.googleRegister), googleAuthController.register);


// NEW: A protected route to get the current user's profile.
// This will validate the session token.
router.get('/me', protect, authController.getMe);

export default router;

