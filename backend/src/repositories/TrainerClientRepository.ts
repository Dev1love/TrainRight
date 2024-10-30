import { Repository, EntityManager, DataSource } from "typeorm";
import { TrainerClientRelationship } from "../models/TrainerClientRelationship";

export class TrainerClientRepository extends Repository<TrainerClientRelationship> {
    constructor(dataSourceOrManager?: DataSource | EntityManager) {
        if (dataSourceOrManager instanceof DataSource) {
            super(TrainerClientRelationship, dataSourceOrManager.createEntityManager());
        } else if (dataSourceOrManager instanceof EntityManager) {
            super(TrainerClientRelationship, dataSourceOrManager);
        } else {
            super(TrainerClientRelationship, new EntityManager({
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

    async findActiveClients(trainerId: string): Promise<TrainerClientRelationship[]> {
        return this.find({
            where: {
                trainer: { user_id: trainerId },
                status: "active"
            },
            relations: ["client"]
        });
    }

    async findClientTrainer(clientId: string): Promise<TrainerClientRelationship | undefined> {
        const relationship = await this.findOne({
            where: {
                client: { user_id: clientId },
                status: "active"
            },
            relations: ["trainer"]
        });
        return relationship || undefined;
    }
} 