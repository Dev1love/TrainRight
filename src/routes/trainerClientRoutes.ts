import { Router } from 'express';
import { TrainerClientService } from '../services/TrainerClientService';
import { authenticate, authorize } from '../middleware/auth';
import { TrainerClientRepository } from '../repositories/TrainerClientRepository';
import { AppDataSource } from '../config/database';
import { ValidationError } from '../utils/errors';

const router = Router();
const trainerClientRepository = new TrainerClientRepository(AppDataSource);
const trainerClientService = new TrainerClientService(trainerClientRepository);

/**
 * @swagger
 * /trainer-client/assign:
 *   post:
 *     summary: Assign a client to a trainer
 *     tags: [Trainer-Client]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *             properties:
 *               clientId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Client assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrainerClientRelationship'
 *       400:
 *         description: Client already has a trainer or invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
router.post('/assign', authenticate, authorize(['trainer']), async (req, res, next) => {
    try {
        const trainerId = req.user.userId;
        const { clientId } = req.body;
        if (!clientId) {
            throw new ValidationError('Client ID is required');
        }
        const relationship = await trainerClientService.assignClient(trainerId, clientId);
        res.status(201).json(relationship);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /trainer-client/clients:
 *   get:
 *     summary: Get all clients for a trainer
 *     tags: [Trainer-Client]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of trainer's clients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TrainerClientRelationship'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
router.get('/clients', authenticate, authorize(['trainer']), async (req, res, next) => {
    try {
        const trainerId = req.user.userId;
        const clients = await trainerClientService.getTrainerClients(trainerId);
        res.json(clients);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /trainer-client/status/{relationshipId}:
 *   put:
 *     summary: Update trainer-client relationship status
 *     tags: [Trainer-Client]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: relationshipId
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, terminated]
 *     responses:
 *       200:
 *         description: Relationship status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrainerClientRelationship'
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Relationship not found
 */
router.put('/status/:relationshipId', authenticate, authorize(['trainer']), async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!status) {
            throw new ValidationError('Status is required');
        }
        const relationship = await trainerClientService.updateRelationshipStatus(
            req.params.relationshipId,
            status
        );
        res.json(relationship);
    } catch (error) {
        next(error);
    }
});

export const trainerClientRoutes = router; 