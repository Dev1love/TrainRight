import { Router } from 'express';
import { UserService } from '../services/UserService';
import { authenticate } from '../middleware/auth';
import { UserRepository } from '../repositories/UserRepository';
import { AppDataSource } from '../config/database';
import { ValidationError, UnauthorizedError, NotFoundError } from '../utils/errors';

const router = Router();
const userRepository = new UserRepository(AppDataSource);
const userService = new UserService(userRepository);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               role:
 *                 type: string
 *                 enum: [client, trainer, admin]
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Invalid input data
 */
router.post('/register', async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.password) {
            throw new ValidationError('Email and password are required');
        }
        const user = await userService.register(req.body);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.password) {
            throw new ValidationError('Email and password are required');
        }
        const result = await userService.login(req.body.email, req.body.password);
        res.json(result);
    } catch (error) {
        next(new UnauthorizedError('Invalid credentials'));
    }
});

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/profile', authenticate, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const user = await userService.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
});

export const userRoutes = router;