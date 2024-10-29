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
exports.trainerClientRoutes = void 0;
const express_1 = require("express");
const TrainerClientService_1 = require("../services/TrainerClientService");
const auth_1 = require("../middleware/auth");
const TrainerClientRepository_1 = require("../repositories/TrainerClientRepository");
const database_1 = require("../config/database");
const errors_1 = require("../utils/errors");
const router = (0, express_1.Router)();
const trainerClientRepository = new TrainerClientRepository_1.TrainerClientRepository(database_1.AppDataSource);
const trainerClientService = new TrainerClientService_1.TrainerClientService(trainerClientRepository);
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
router.post('/assign', auth_1.authenticate, (0, auth_1.authorize)(['trainer']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trainerId = req.user.userId;
        const { clientId } = req.body;
        if (!clientId) {
            throw new errors_1.ValidationError('Client ID is required');
        }
        const relationship = yield trainerClientService.assignClient(trainerId, clientId);
        res.status(201).json(relationship);
    }
    catch (error) {
        next(error);
    }
}));
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
router.get('/clients', auth_1.authenticate, (0, auth_1.authorize)(['trainer']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trainerId = req.user.userId;
        const clients = yield trainerClientService.getTrainerClients(trainerId);
        res.json(clients);
    }
    catch (error) {
        next(error);
    }
}));
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
router.put('/status/:relationshipId', auth_1.authenticate, (0, auth_1.authorize)(['trainer']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        if (!status) {
            throw new errors_1.ValidationError('Status is required');
        }
        const relationship = yield trainerClientService.updateRelationshipStatus(req.params.relationshipId, status);
        res.json(relationship);
    }
    catch (error) {
        next(error);
    }
}));
exports.trainerClientRoutes = router;
