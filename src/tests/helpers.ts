import request from 'supertest';
import { app } from '../app';
import { userRepository } from './setup';

export const createTestUser = async (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
}) => {
    const response = await request(app)
        .post('/api/users/register')
        .send(userData);
    return response.body;
};

export const loginTestUser = async (email: string, password: string) => {
    const response = await request(app)
        .post('/api/users/login')
        .send({ email, password });
    return response.body;
};

export const createAuthHeader = (token: string) => ({
    Authorization: `Bearer ${token}`
}); 