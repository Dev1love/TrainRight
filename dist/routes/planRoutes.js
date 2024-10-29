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
exports.planRoutes = void 0;
const express_1 = require("express");
const TrainingPlanService_1 = require("../services/TrainingPlanService");
const auth_1 = require("../middleware/auth");
const TrainingPlanRepository_1 = require("../repositories/TrainingPlanRepository");
const database_1 = require("../config/database");
const errors_1 = require("../utils/errors");
const router = (0, express_1.Router)();
const planRepository = new TrainingPlanRepository_1.TrainingPlanRepository(database_1.AppDataSource);
const planService = new TrainingPlanService_1.TrainingPlanService(planRepository);
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
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(['trainer']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trainerId = req.user.userId;
        const plan = yield planService.createPlan(trainerId, req.body);
        res.status(201).json(plan);
    }
    catch (error) {
        next(error); // Pass to error handler middleware
    }
}));
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
router.get('/:planId', auth_1.authenticate, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plan = yield planService.getPlanDetails(req.params.planId);
        if (!plan) {
            throw new errors_1.NotFoundError('Plan not found');
        }
        res.json(plan);
    }
    catch (error) {
        next(error);
    }
}));
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
router.put('/:planId', auth_1.authenticate, (0, auth_1.authorize)(['trainer']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plan = yield planService.updatePlan(req.params.planId, req.body);
        res.json(plan);
    }
    catch (error) {
        next(error);
    }
}));
exports.planRoutes = router;
