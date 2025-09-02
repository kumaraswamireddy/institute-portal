import { Router, Request, Response, NextFunction } from 'express';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';
import courseRoutes from './course.routes';
import instituteRoutes from './institute.routes';
import marketplaceRoutes from './marketplace.routes';
import paymentRoutes from './payment.routes';
import studentRoutes from './student.routes';

const router = Router();

// =================================================================
// <<< NEW DEBUGGING MIDDLEWARE >>>
// This will log every incoming request to the v1 API to your terminal.
// =================================================================
router.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[API V1 DEBUG] Received request for: ${req.method} ${req.originalUrl}`);
    next();
});


// All authentication routes are correctly grouped under the '/auth' prefix.
router.use('/auth', authRoutes);

// Other routes
router.use('/admin', adminRoutes);
router.use('/courses', courseRoutes);
router.use('/institutes', instituteRoutes);
router.use('/marketplace', marketplaceRoutes);
router.use('/payments', paymentRoutes);
router.use('/students', studentRoutes);


export default router;

