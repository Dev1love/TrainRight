import request from 'supertest';
import { app } from '../../app';
import { createTestUser, loginTestUser, createAuthHeader } from '../helpers';

describe('Trainer-Client Relationship', () => {
    let trainerToken: string;
    let clientId: string;

    beforeEach(async () => {
        // Create trainer
        await createTestUser({
            name: 'Trainer',
            email: 'trainer@example.com',
            password: 'password123',
            role: 'trainer'
        });

        // Create client
        const clientResponse = await createTestUser({
            name: 'Client',
            email: 'client@example.com',
            password: 'password123',
            role: 'client'
        });
        clientId = clientResponse.user_id;

        // Login as trainer
        const loginResponse = await loginTestUser('trainer@example.com', 'password123');
        trainerToken = loginResponse.token;
    });

    describe('POST /api/trainer-client/assign', () => {
        it('should assign client to trainer successfully', async () => {
            const response = await request(app)
                .post('/api/trainer-client/assign')
                .set(createAuthHeader(trainerToken))
                .send({ clientId });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('relationship_id');
            expect(response.body.status).toBe('pending');
        });

        it('should not allow assigning already assigned client', async () => {
            // First assignment
            await request(app)
                .post('/api/trainer-client/assign')
                .set(createAuthHeader(trainerToken))
                .send({ clientId });

            // Second assignment
            const response = await request(app)
                .post('/api/trainer-client/assign')
                .set(createAuthHeader(trainerToken))
                .send({ clientId });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Client already has an active trainer');
        });
    });
}); 