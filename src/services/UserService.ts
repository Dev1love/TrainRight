import { UserRepository } from "../repositories/UserRepository";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const VALID_ROLES = ['client', 'trainer', 'admin'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export class UserService {
    constructor(private userRepository: UserRepository) {}

    async register(userData: {
        name: string;
        email: string;
        password: string;
        role: string;
    }): Promise<User> {
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

        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error("Email already registered");
        }

        const passwordHash = await bcrypt.hash(userData.password, 10);
        const user = this.userRepository.create({
            ...userData,
            password_hash: passwordHash
        });

        // Save the user and return the complete object for testing purposes
        return this.userRepository.save(user);
    }

    async login(email: string, password: string): Promise<{ token: string; user: Omit<User, 'password_hash'> }> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign(
            { userId: user.user_id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "24h" }
        );

        // Remove password_hash only when returning to client
        const { password_hash, ...userWithoutPassword } = user;
        return { token, user: userWithoutPassword };
    }

    async findById(userId: string): Promise<Omit<User, 'password_hash'>> {
        const user = await this.userRepository.findOne({ where: { user_id: userId } });
        if (!user) {
            throw new Error("User not found");
        }

        // Remove password_hash only when returning to client
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    // Helper method for internal use (like in tests)
    async _findByIdWithPassword(userId: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { user_id: userId } });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
} 