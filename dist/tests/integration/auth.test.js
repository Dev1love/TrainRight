"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../app");
const setup_1 = require("../setup");
const helpers_1 = require("../helpers");
jest.mock('../../routes/userRoutes', () => {
    const { UserService } = jest.requireActual('../../services/UserService');
    const { Router } = jest.requireActual('express');
    const router = Router();
    const userService = new UserService(setup_1.userRepository);
    router.post('/register', async (req, res) => {
        try {
            const user = await userService.register(req.body);
            res.status(201).json(user);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
    return { userRoutes: router };
});
describe('Authentication', () => {
    beforeEach(async () => {
    });
    describe('POST /api/users/register', () => {
        it('should register a new user successfully', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/users/register')
                .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                role: 'client'
            });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('user_id');
            expect(response.body.email).toBe('test@example.com');
            expect(response.body).not.toHaveProperty('password_hash');
            expect(response.body.role).toBe('client');
        });
        it('should not register user with invalid email format', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/users/register')
                .send({
                name: 'Test User',
                email: 'invalid-email',
                password: 'password123',
                role: 'client'
            });
            expect(response.status).toBe(400);
            expect(response.body.message).toContain('Invalid email format');
        });
        it('should not register user with short password', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/users/register')
                .send({
                name: 'Test User',
                email: 'test@example.com',
                password: '123',
                role: 'client'
            });
            expect(response.status).toBe(400);
            expect(response.body.message).toContain('Password must be at least 8 characters');
        });
        it('should not register user with invalid role', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/users/register')
                .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                role: 'invalid-role'
            });
            expect(response.status).toBe(400);
            expect(response.body.message).toContain('Invalid role');
        });
    });
    describe('POST /api/users/login', () => {
        beforeEach(async () => {
            await (0, helpers_1.createTestUser)({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                role: 'client'
            });
        });
        it('should login successfully with correct credentials', async () => {
            const response = await (0, helpers_1.loginTestUser)('test@example.com', 'password123');
            expect(response).toHaveProperty('token');
            expect(response).toHaveProperty('user');
            expect(response.user).toHaveProperty('user_id');
            expect(response.user.email).toBe('test@example.com');
            expect(response.user).not.toHaveProperty('password_hash');
        });
        it('should fail with non-existent email', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/users/login')
                .send({
                email: 'nonexistent@example.com',
                password: 'password123'
            });
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid credentials');
        });
        it('should fail with missing credentials', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/users/login')
                .send({});
            expect(response.status).toBe(400);
            expect(response.body.message).toContain('Email and password are required');
        });
    });
    describe('Authentication Middleware', () => {
        let userToken;
        beforeEach(async () => {
            await (0, helpers_1.createTestUser)({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                role: 'client'
            });
            const loginResponse = await (0, helpers_1.loginTestUser)('test@example.com', 'password123');
            userToken = loginResponse.token;
        });
        it('should allow access with valid token', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/api/users/profile')
                .set((0, helpers_1.createAuthHeader)(userToken));
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('user_id');
        });
        it('should deny access without token', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/api/users/profile');
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Authentication required');
        });
        it('should deny access with invalid token', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/api/users/profile')
                .set((0, helpers_1.createAuthHeader)('invalid-token'));
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid token');
        });
        it('should deny access with expired token', async () => {
            const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTYiLCJyb2xlIjoiY2xpZW50IiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.2hDgYnZA7GX7HkZhsZK8Q8dXX5Q5Z5Z5Z5Z5Z5Z5Z5Z';
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/api/users/profile')
                .set((0, helpers_1.createAuthHeader)(expiredToken));
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid token');
        });
    });
    describe('Authorization Middleware', () => {
        let clientToken;
        let trainerToken;
        let adminToken;
        beforeEach(async () => {
            await (0, helpers_1.createTestUser)({
                name: 'Client User',
                email: 'client@example.com',
                password: 'password123',
                role: 'client'
            });
            await (0, helpers_1.createTestUser)({
                name: 'Trainer User',
                email: 'trainer@example.com',
                password: 'password123',
                role: 'trainer'
            });
            await (0, helpers_1.createTestUser)({
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin'
            });
            const clientLogin = await (0, helpers_1.loginTestUser)('client@example.com', 'password123');
            const trainerLogin = await (0, helpers_1.loginTestUser)('trainer@example.com', 'password123');
            const adminLogin = await (0, helpers_1.loginTestUser)('admin@example.com', 'password123');
            clientToken = clientLogin.token;
            trainerToken = trainerLogin.token;
            adminToken = adminLogin.token;
        });
        it('should allow trainer access to trainer-only routes', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/api/plans/trainer')
                .set((0, helpers_1.createAuthHeader)(trainerToken));
            expect(response.status).not.toBe(403);
        });
        it('should deny client access to trainer-only routes', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/api/plans/trainer')
                .set((0, helpers_1.createAuthHeader)(clientToken));
            expect(response.status).toBe(403);
            expect(response.body.message).toBe('Insufficient permissions');
        });
        it('should allow admin access to admin routes', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/api/admin/users')
                .set((0, helpers_1.createAuthHeader)(adminToken));
            expect(response.status).not.toBe(403);
        });
        it('should deny trainer access to admin routes', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/api/admin/users')
                .set((0, helpers_1.createAuthHeader)(trainerToken));
            expect(response.status).toBe(403);
            expect(response.body.message).toBe('Insufficient permissions');
        });
    });
});
//# sourceMappingURL=auth.test.js.map