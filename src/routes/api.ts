import { Router } from 'express';
import { userRoutes } from './userRoutes';
import { planRoutes } from './planRoutes';
import { workoutRoutes } from './workoutRoutes';
import { trainerClientRoutes } from './trainerClientRoutes';
import { adminRoutes } from './adminRoutes';

const router = Router();

// Public routes
router.use('/users', userRoutes);

// Protected routes
router.use('/plans', planRoutes);
router.use('/workouts', workoutRoutes);
router.use('/trainer-client', trainerClientRoutes);

// Admin routes
router.use('/admin', adminRoutes);

export default router; 