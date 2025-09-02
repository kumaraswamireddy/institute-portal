import { Router } from 'express';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';
import instituteRoutes from './institute.routes';
import courseRoutes from './course.routes';
import studentRoutes from './student.routes';
import marketplaceRoutes from './marketplace.routes';
import paymentRoutes from './payment.routes';
import { googleAuthRoutes } from './googleAuth.routes'; // New feature import

const router = Router();

// --- Existing Routes ---
router.use('/auth', authRoutes); // For Platform Admins
router.use('/admin', adminRoutes);
router.use('/institutes', instituteRoutes);
router.use('/courses', courseRoutes);
router.use('/students', studentRoutes);
router.use('/marketplace', marketplaceRoutes);
router.use('/payments', paymentRoutes);

// --- New Feature Route ---
// For public-facing Student & Institute Google Sign-In
router.use('/user', googleAuthRoutes);

export default router;
