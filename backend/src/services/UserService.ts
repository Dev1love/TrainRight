import { User } from "../models/User";
import { AppDataSource } from "../config/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ValidationError } from "../types/errors";

export class UserService {
    private userRepository = AppDataSource.getRepository(User);

    async validateUser(email: string, password: string): Promise<User | null> {
        try {
            console.log('Starting user validation for:', email);
            
            const user = await this.userRepository.findOne({ where: { email } });
            console.log('Database query result:', { 
                userFound: !!user,
                userEmail: user?.email,
                hasPassword: !!user?.password
            });
            
            if (!user) {
                console.log('User not found');
                return null;
            }

            // Generate a new hash with the same password for comparison
            const testHash = await bcrypt.hash(password, 10);
            console.log('Test hash generation:');
            console.log('Input password:', password);
            console.log('Stored hash:', user.password);
            console.log('New test hash:', testHash);
            
            const isValidPassword = await bcrypt.compare(password, user.password);
            console.log('Password comparison result:', isValidPassword);

            if (!isValidPassword) {
                console.log('Invalid password');
                return null;
            }

            console.log('User validated successfully');
            return user;
        } catch (error) {
            console.error('Error in validateUser:', error);
            throw error;
        }
    }

    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);
        
        if (!user) {
            throw new ValidationError('Invalid credentials');
        }

        const token = jwt.sign(
            { userId: user.user_id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        const { password: _, ...userWithoutPassword } = user;
        return { token, user: userWithoutPassword };
    }

    async register(data: {
        name: string;
        email: string;
        password: string;
        role: string;
    }) {
        // Check if user already exists
        const existingUser = await this.findByEmail(data.email);
        if (existingUser) {
            throw new ValidationError('Email already registered');
        }

        const user = await this.createUser(data);
        
        const token = jwt.sign(
            { userId: user.user_id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        const { password: _, ...userWithoutPassword } = user;
        return { token, user: userWithoutPassword };
    }

    async createUser(data: {
        name: string;
        email: string;
        password: string;
        role: string;
    }): Promise<User> {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        const user = this.userRepository.create({
            ...data,
            password: hashedPassword
        });

        return this.userRepository.save(user);
    }

    async findById(id: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { user_id: id } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    async updateUser(id: string, data: Partial<User>): Promise<User | null> {
        await this.userRepository.update(id, data);
        return this.findById(id);
    }
} 