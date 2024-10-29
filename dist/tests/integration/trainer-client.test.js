"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../app");
const helpers_1 = require("../helpers");
describe('Trainer-Client Relationship', () => {
    let trainerToken;
    let clientId;
    beforeEach(async () => {
        await (0, helpers_1.createTestUser)({
            name: 'Trainer',
            email: 'trainer@example.com',
            password: 'password123',
            role: 'trainer'
        });
        const clientResponse = await (0, helpers_1.createTestUser)({
            name: 'Client',
            email: 'client@example.com',
            password: 'password123',
            role: 'client'
        });
        clientId = clientResponse.user_id;
        const loginResponse = await (0, helpers_1.loginTestUser)('trainer@example.com', 'password123');
        trainerToken = loginResponse.token;
    });
    describe('POST /api/trainer-client/assign', () => {
        it('should assign client to trainer successfully', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/trainer-client/assign')
                .set((0, helpers_1.createAuthHeader)(trainerToken))
                .send({ clientId });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('relationship_id');
            expect(response.body.status).toBe('pending');
        });
        it('should not allow assigning already assigned client', async () => {
            await (0, supertest_1.default)(app_1.app)
                .post('/api/trainer-client/assign')
                .set((0, helpers_1.createAuthHeader)(trainerToken))
                .send({ clientId });
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/trainer-client/assign')
                .set((0, helpers_1.createAuthHeader)(trainerToken))
                .send({ clientId });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Client already has an active trainer');
        });
    });
});
//# sourceMappingURL=trainer-client.test.js.map