"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workoutRoutes = void 0;
const express_1 = require("express");
const WorkoutService_1 = require("../services/WorkoutService");
const auth_1 = require("../middleware/auth");
const WorkoutRepository_1 = require("../repositories/WorkoutRepository");
const database_1 = require("../config/database");
const errors_1 = require("../utils/errors");
const router = (0, express_1.Router)();
const workoutRepository = new WorkoutRepository_1.WorkoutRepository(database_1.AppDataSource);
const workoutService = new WorkoutService_1.WorkoutService(workoutRepository);
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
router.post('/start', auth_1.authenticate, (0, auth_1.authorize)(['client']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientId = req.user.userId;
        const { planId } = req.body;
        if (!planId) {
            throw new errors_1.ValidationError('Plan ID is required');
        }
        const workout = yield workoutService.startWorkout(clientId, planId);
        res.status(201).json(workout);
    }
    catch (error) {
        next(error);
    }
}));
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
router.post('/:workoutId/progress', auth_1.authenticate, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const progress = yield workoutService.recordProgress(req.params.workoutId, req.body);
        res.json(progress);
    }
    catch (error) {
        next(error);
    }
}));
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
router.post('/:workoutId/complete', auth_1.authenticate, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workout = yield workoutService.completeWorkout(req.params.workoutId);
        res.json(workout);
    }
    catch (error) {
        next(error);
    }
}));
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
router.get('/client', auth_1.authenticate, (0, auth_1.authorize)(['client']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientId = req.user.userId;
        const { startDate, endDate } = req.query;
        const workouts = yield workoutService.getClientWorkouts(clientId, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
        res.json(workouts);
    }
    catch (error) {
        next(error);
    }
}));
exports.workoutRoutes = router;
