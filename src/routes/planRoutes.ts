import { Router } from 'express';
import { TrainingPlanService } from '../services/TrainingPlanService';
import { authenticate, authorize } from '../middleware/auth';
import { TrainingPlanRepository } from '../repositories/TrainingPlanRepository';
import { AppDataSource } from '../config/database';
import { NotFoundError, ValidationError } from '../utils/errors';

const router = Router();
const planRepository = new TrainingPlanRepository(AppDataSource);
const planService = new TrainingPlanService(planRepository);

/**
 * @swagger
 * /plans:
 *   post:
 *     summary: Create a new training plan
 *     tags: [Training Plans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plan_name
 *               - description
 *               - exercises
 *             properties:
 *               plan_name:
 *                 type: string
 *               description:
 *                 type: string
 *               exercises:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/PlanExercise'
 *     responses:
 *       201:
 *         description: Training plan created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
router.post('/', authenticate, authorize(['trainer']), async (req, res, next) => {
    try {
        const trainerId = req.user.userId;
        const plan = await planService.createPlan(trainerId, req.body);
        res.status(201).json(plan);
    } catch (error) {
        next(error); // Pass to error handler middleware
    }
});

/**
 * @swagger
 * /plans/{planId}:
 *   get:
 *     summary: Get details of a specific training plan
 *     tags: [Training Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Training plan details
 *       404:
 *         description: Plan not found
 */
router.get('/:planId', authenticate, async (req, res, next) => {
    try {
        const plan = await planService.getPlanDetails(req.params.planId);
        if (!plan) {
            throw new NotFoundError('Plan not found');
        }
        res.json(plan);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /plans/{planId}:
 *   put:
 *     summary: Update a training plan
 *     tags: [Training Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TrainingPlan'
 *     responses:
 *       200:
 *         description: Plan updated successfully
 *       404:
 *         description: Plan not found
 */
router.put('/:planId', authenticate, authorize(['trainer']), async (req, res, next) => {
    try {
        const plan = await planService.updatePlan(req.params.planId, req.body);
        res.json(plan);
    } catch (error) {
        next(error);
    }
});

export const planRoutes = router;