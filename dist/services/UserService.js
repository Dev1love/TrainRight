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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const VALID_ROLES = ['client', 'trainer', 'admin'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate email format
            if (!EMAIL_REGEX.test(userData.email)) {
                throw new Error("Invalid email format");
            }
            // Validate password length
            if (userData.password.length < MIN_PASSWORD_LENGTH) {
                throw new Error("Password must be at least 8 characters");
            }
            // Validate role
            if (!VALID_ROLES.includes(userData.role)) {
                throw new Error("Invalid role");
            }
            const existingUser = yield this.userRepository.findByEmail(userData.email);
            if (existingUser) {
                throw new Error("Email already registered");
            }
            const passwordHash = yield bcryptjs_1.default.hash(userData.password, 10);
            const user = this.userRepository.create(Object.assign(Object.assign({}, userData), { password_hash: passwordHash }));
            // Save the user and return the complete object for testing purposes
            return this.userRepository.save(user);
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByEmail(email);
            if (!user) {
                throw new Error("Invalid credentials");
            }
            const isValidPassword = yield bcryptjs_1.default.compare(password, user.password_hash);
            if (!isValidPassword) {
                throw new Error("Invalid credentials");
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });
            // Remove password_hash only when returning to client
            const { password_hash } = user, userWithoutPassword = __rest(user, ["password_hash"]);
            return { token, user: userWithoutPassword };
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ where: { user_id: userId } });
            if (!user) {
                throw new Error("User not found");
            }
            // Remove password_hash only when returning to client
            const { password_hash } = user, userWithoutPassword = __rest(user, ["password_hash"]);
            return userWithoutPassword;
        });
    }
    // Helper method for internal use (like in tests)
    _findByIdWithPassword(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ where: { user_id: userId } });
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        });
    }
}
exports.UserService = UserService;
