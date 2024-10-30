import { UserService } from '../../services/UserService';
import { MockUserRepository } from '../mocks/MockUserRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('UserService', () => {
    let userService: UserService;
    let userRepository: MockUserRepository;

    beforeEach(() => {
        userRepository = new MockUserRepository();
        userService = new UserService(userRepository);
        process.env.JWT_SECRET = 'test-secret';
    });

    describe('register', () => {
        const validUserData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'client'
        };

        it('should successfully register a new user', async () => {
            const user = await userService.register(validUserData);

            expect(user).toHaveProperty('user_id');
            expect(user.email).toBe(validUserData.email);
            expect(user.name).toBe(validUserData.name);
            expect(user.role).toBe(validUserData.role);
            expect(user).not.toHaveProperty('password');
            expect(user.password_hash).toBeDefined();
        });

        it('should hash the password', async () => {
            const user = await userService.register(validUserData);
            const isValidPassword = await bcrypt.compare(validUserData.password, user.password_hash);
            
            expect(isValidPassword).toBe(true);
        });

        it('should not allow duplicate emails', async () => {
            await userService.register(validUserData);
            
            await expect(userService.register(validUserData))
                .rejects
                .toThrow('Email already registered');
        });

        it('should validate email format', async () => {
            const invalidEmailData = { ...validUserData, email: 'invalid-email' };
            
            await expect(userService.register(invalidEmailData))
                .rejects
                .toThrow('Invalid email format');
        });

        it('should validate password length', async () => {
            const shortPasswordData = { ...validUserData, password: '123' };
            
            await expect(userService.register(shortPasswordData))
                .rejects
                .toThrow('Password must be at least 8 characters');
        });

        it('should validate role', async () => {
            const invalidRoleData = { ...validUserData, role: 'invalid-role' };
            
            await expect(userService.register(invalidRoleData))
                .rejects
                .toThrow('Invalid role');
        });
    });

    describe('login', () => {
        beforeEach(async () => {
            await userService.register({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                role: 'client'
            });
        });

        it('should successfully login with correct credentials', async () => {
            const result = await userService.login('test@example.com', 'password123');

            expect(result).toHaveProperty('token');
            expect(result).toHaveProperty('user');
            expect(result.user.email).toBe('test@example.com');
            expect(result.user).not.toHaveProperty('password_hash');
        });

        it('should generate a valid JWT token', async () => {
            const { token, user } = await userService.login('test@example.com', 'password123');
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

            expect(decoded.userId).toBe(user.user_id);
            expect(decoded.role).toBe(user.role);
        });

        it('should fail with incorrect password', async () => {
            await expect(userService.login('test@example.com', 'wrongpassword'))
                .rejects
                .toThrow('Invalid credentials');
        });

        it('should fail with non-existent email', async () => {
            await expect(userService.login('nonexistent@example.com', 'password123'))
                .rejects
                .toThrow('Invalid credentials');
        });
    });

    describe('findById', () => {
        let userId: string;

        beforeEach(async () => {
            const user = await userService.register({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                role: 'client'
            });
            userId = user.user_id;
        });

        it('should find user by id', async () => {
            const user = await userService.findById(userId);

            expect(user.user_id).toBe(userId);
            expect(user.email).toBe('test@example.com');
        });

        it('should throw error for non-existent user', async () => {
            await expect(userService.findById('non-existent-id'))
                .rejects
                .toThrow('User not found');
        });
    });
}); 