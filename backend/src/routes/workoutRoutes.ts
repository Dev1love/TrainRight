import { Router } from 'express';
import { WorkoutService } from '../services/WorkoutService';
import { authenticate, authorize } from '../middleware/auth';
import { WorkoutRepository } from '../repositories/WorkoutRepository';
import { AppDataSource } from '../config/database';
import { ValidationError } from '../utils/errors';

const router = Router();
const workoutRepository = new WorkoutRepository(AppDataSource);
const workoutService = new WorkoutService(workoutRepository);

/**
 * @swagger
 * /workouts/start:
 *   post:
 *     summary: Start a new workout from a training plan
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planId
 *             properties:
 *               planId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Workout started successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClientWorkout'
 *       400:
 *         description: Invalid input or plan not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
router.post('/start', authenticate, authorize(['client']), async (req, res, next) => {
    try {
        const clientId = req.user.userId;
        const { planId } = req.body;
        if (!planId) {
            throw new ValidationError('Plan ID is required');
        }
        const workout = await workoutService.startWorkout(clientId, planId);
        res.status(201).json(workout);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /workouts/{workoutId}/progress:
 *   post:
 *     summary: Record progress for a workout exercise
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exerciseId
 *               - completedSets
 *               - completedReps
 *             properties:
 *               exerciseId:
 *                 type: string
 *                 format: uuid
 *               completedSets:
 *                 type: integer
 *                 minimum: 0
 *               completedReps:
 *                 type: integer
 *                 minimum: 0
 *               weight:
 *                 type: number
 *                 format: float
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Progress recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkoutProgress'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout or exercise not found
 */
router.post('/:workoutId/progress', authenticate, async (req, res, next) => {
    try {
        const progress = await workoutService.recordProgress(
            req.params.workoutId,
            req.body
        );
        res.json(progress);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /workouts/{workoutId}/complete:
 *   post:
 *     summary: Complete a workout
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Workout completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClientWorkout'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout not found
 */
router.post('/:workoutId/complete', authenticate, async (req, res, next) => {
    try {
        const workout = await workoutService.completeWorkout(req.params.workoutId);
        res.json(workout);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /workouts/client:
 *   get:
 *     summary: Get client's workout history
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering workouts
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering workouts
 *     responses:
 *       200:
 *         description: List of client's workouts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ClientWorkout'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
router.get('/client', authenticate, authorize(['client']), async (req, res, next) => {
    try {
        const clientId = req.user.userId;
        const { startDate, endDate } = req.query;
        const workouts = await workoutService.getClientWorkouts(
            clientId,
            startDate ? new Date(startDate as string) : undefined,
            endDate ? new Date(endDate as string) : undefined
        );
        res.json(workouts);
    } catch (error) {
        next(error);
    }
});

export const workoutRoutes = router;