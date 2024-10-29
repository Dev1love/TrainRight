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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockUserRepository = void 0;
const UserRepository_1 = require("../../repositories/UserRepository");
class MockUserRepository extends UserRepository_1.UserRepository {
    constructor() {
        super();
        this.users = [];
        Object.setPrototypeOf(this, MockUserRepository.prototype);
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.users.find(user => user.email === email);
        });
    }
    findByRole(role) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.users.filter(user => user.role === role);
        });
    }
    findOne(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options.where && typeof options.where === 'object') {
                const where = options.where;
                if (where.email) {
                    const user = this.users.find(user => user.email === where.email);
                    return user || null;
                }
                if (where.user_id) {
                    const user = this.users.find(user => user.user_id === where.user_id);
                    return user || null;
                }
            }
            return null;
        });
    }
    save(entityOrEntities) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(entityOrEntities)) {
                return entityOrEntities.map(entity => this.saveOne(entity));
            }
            return this.saveOne(entityOrEntities);
        });
    }
    saveOne(user) {
        const existingUserIndex = this.users.findIndex(u => u.user_id === user.user_id);
        if (existingUserIndex >= 0) {
            this.users[existingUserIndex] = user;
            return user;
        }
        const newUser = Object.assign(Object.assign({}, user), { user_id: String(this.users.length + 1), created_at: new Date(), updated_at: new Date() });
        this.users.push(newUser);
        return newUser;
    }
    create(entityLike) {
        if (Array.isArray(entityLike)) {
            return entityLike.map(data => this.createOne(data));
        }
        return this.createOne(entityLike || {});
    }
    createOne(userData) {
        return {
            user_id: String(this.users.length + 1),
            name: userData.name || '',
            email: userData.email || '',
            password_hash: userData.password_hash || '',
            role: userData.role || 'client',
            created_at: new Date(),
            updated_at: new Date()
        };
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            this.users = [];
        });
    }
}
exports.MockUserRepository = MockUserRepository;
