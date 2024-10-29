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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthHeader = exports.loginTestUser = exports.createTestUser = void 0;
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const createTestUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, supertest_1.default)(app_1.app)
        .post('/api/users/register')
        .send(userData);
    return response.body;
});
exports.createTestUser = createTestUser;
const loginTestUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, supertest_1.default)(app_1.app)
        .post('/api/users/login')
        .send({ email, password });
    return response.body;
});
exports.loginTestUser = loginTestUser;
const createAuthHeader = (token) => ({
    Authorization: `Bearer ${token}`
});
exports.createAuthHeader = createAuthHeader;