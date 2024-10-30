import { Repository, EntityManager, DataSource } from "typeorm";
import { User } from "../models/User";

export class UserRepository extends Repository<User> {
    constructor(dataSourceOrManager?: DataSource | EntityManager) {
        if (dataSourceOrManager instanceof DataSource) {
            super(User, dataSourceOrManager.createEntityManager());
        } else if (dataSourceOrManager instanceof EntityManager) {
            super(User, dataSourceOrManager);
        } else {
            // For testing purposes, we'll create a minimal manager
            super(User, new EntityManager({
                "@instanceof": Symbol.for("DataSource"),
                options: {},
                manager: undefined as any,
                name: "default",
                isInitialized: true,
                driver: {
                    options: {},
                    isInitialized: true,
                } as any,
            } as DataSource));
        }
    }

    async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.findOne({ where: { email } });
        return user || undefined;
    }

    async findByRole(role: string): Promise<User[]> {
        return this.find({ where: { role } });
    }
} 