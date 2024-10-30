import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import jwt from 'jsonwebtoken';

export class AuthController {
    static async login(req: Request, res: Response) {
        try {
            console.log('Login attempt:', req.body);
            const { email, password } = req.body;
            const userService = new UserService();
            
            const user = await userService.validateUser(email, password);
            console.log('Validation result:', { userFound: !!user });
            
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { userId: user.user_id, role: user.role },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            const { password: _, ...userWithoutPassword } = user;
            console.log('Login successful:', { userId: user.user_id, role: user.role });

            return res.json({ token, user: userWithoutPassword });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async register(req: Request, res: Response) {
        try {
            const { name, email, password, role } = req.body;
            const userService = new UserService();
            const user = await userService.createUser({ name, email, password, role });
            
            const token = jwt.sign(
                { userId: user.user_id, role: user.role },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            const { password: _, ...userWithoutPassword } = user;

            return res.status(201).json({ token, user: userWithoutPassword });
        } catch (error) {
            console.error('Registration error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
} 