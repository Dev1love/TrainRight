import { Router } from 'express';
import { UserService } from '../services/UserService';
import { authenticate } from '../middleware/auth';
import { ValidationError } from '../types/errors';

const router = Router();
const userService = new UserService();

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
router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await userService.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove sensitive data from response
        const { password: _, ...userWithoutPassword } = user as any;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile' });
    }
});

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *       200:
 *         description: User profile updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put('/profile', authenticate, async (req, res) => {
    try {
        const updatedUser = await userService.updateUser(req.user.userId, req.body);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password: _, ...userWithoutPassword } = updatedUser as any;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user profile' });
    }
});

export const userRoutes = router;