import { Router } from 'express';
import { userRoutes } from './userRoutes';
import { planRoutes } from './planRoutes';
import { workoutRoutes } from './workoutRoutes';
import { trainerClientRoutes } from './trainerClientRoutes';
import { adminRoutes } from './adminRoutes';
import { authRoutes } from './authRoutes';

const router = Router();

// Add logging middleware for all routes
router.use((req, res, next) => {
  console.log('API Request:', {
    method: req.method,
    originalUrl: req.originalUrl,
    path: req.path,
    body: req.body
  });
  next();
});

// Auth routes should come first
router.use('/auth', authRoutes);

// Other routes
router.use('/users', userRoutes);
router.use('/plans', planRoutes);
router.use('/workouts', workoutRoutes);
router.use('/trainer-client', trainerClientRoutes);
router.use('/admin', adminRoutes);

export default router; 