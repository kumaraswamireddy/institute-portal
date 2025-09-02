import { Router, Request, Response } from 'express';
import { authController } from '../controllers/auth.controller';
import { googleAuthController } from '../controllers/googleAuth.controller';
import { validate } from '../middlewares/validator.middleware';
import { authValidator } from '../validators/auth.validator';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// =================================================================
// <<< NEW DEBUGGING ROUTE >>>
// A simple health check to confirm this router is working.
// =================================================================
router.get('/healthcheck', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'Auth router is reachable' });
});


// This router will be mounted under an '/auth' prefix in the main router.
// Therefore, the paths here should be relative to '/auth'.

// Admin Route: POST /api/v1/auth/login
router.post('/login', validate(authValidator.login), authController.login);

// Admin Route: POST /api/v1/auth/logout
router.post('/logout', authController.logout);

// Admin Route: POST /api/v1/auth/refresh-token
router.post('/refresh-token', protect, authController.refreshAccessToken);

// Google OAuth Route: POST /api/v1/auth/google/signin
router.post('/google/signin', validate(authValidator.googleSignIn), googleAuthController.googleSignIn);

// Google OAuth Route: POST /api/v1/auth/google/register
router.post('/google/register', validate(authValidator.googleRegister), googleAuthController.register);

export default router;

