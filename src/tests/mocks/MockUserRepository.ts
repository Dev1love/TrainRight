import { User } from "../../models/User";
import { UserRepository } from "../../repositories/UserRepository";
import { FindOneOptions, DeepPartial } from "typeorm";

export class MockUserRepository extends UserRepository {
    private users: User[] = [];

    constructor() {
        super();
        Object.setPrototypeOf(this, MockUserRepository.prototype);
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.users.find(user => user.email === email);
    }

    async findByRole(role: string): Promise<User[]> {
        return this.users.filter(user => user.role === role);
    }

    async findOne(options: FindOneOptions<User>): Promise<User | null> {
        if (options.where && typeof options.where === 'object') {
            const where = options.where as any;
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
    }

    async save<T extends DeepPartial<User>>(entityOrEntities: T | T[]): Promise<T | T[]> {
        if (Array.isArray(entityOrEntities)) {
            return entityOrEntities.map(entity => this.saveOne(entity as User)) as T[];
        }
        return this.saveOne(entityOrEntities as User) as T;
    }

    private saveOne(user: User): User {
        const existingUserIndex = this.users.findIndex(u => u.user_id === user.user_id);
        if (existingUserIndex >= 0) {
            this.users[existingUserIndex] = user;
            return user;
        }
        
        const newUser = {
            ...user,
            user_id: String(this.users.length + 1),
            created_at: new Date(),
            updated_at: new Date()
        };
        this.users.push(newUser);
        return newUser;
    }

    create(): User;
    create(entityLike: DeepPartial<User>): User;
    create(entityLikeArray: DeepPartial<User>[]): User[];
    create(entityLike?: DeepPartial<User> | DeepPartial<User>[]): User | User[] {
        if (Array.isArray(entityLike)) {
            return entityLike.map(data => this.createOne(data));
        }
        return this.createOne(entityLike || {});
    }

    private createOne(userData: DeepPartial<User>): User {
        return {
            user_id: String(this.users.length + 1),
            name: userData.name || '',
            email: userData.email || '',
            password_hash: userData.password_hash || '',
            role: userData.role || 'client',
            created_at: new Date(),
            updated_at: new Date()
        } as User;
    }

    async clear(): Promise<void> {
        this.users = [];
    }
} 