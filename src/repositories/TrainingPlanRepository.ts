import { Repository, EntityManager, DataSource } from "typeorm";
import { TrainingPlan } from "../models/TrainingPlan";

export class TrainingPlanRepository extends Repository<TrainingPlan> {
    constructor(dataSourceOrManager?: DataSource | EntityManager) {
        if (dataSourceOrManager instanceof DataSource) {
            super(TrainingPlan, dataSourceOrManager.createEntityManager());
        } else if (dataSourceOrManager instanceof EntityManager) {
            super(TrainingPlan, dataSourceOrManager);
        } else {
            // For testing purposes, we'll create a minimal manager
            super(TrainingPlan, new EntityManager({
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

    async findByTrainer(trainerId: string): Promise<TrainingPlan[]> {
        return this.find({
            where: { trainer: { user_id: trainerId } },
            relations: ["trainer"]
        });
    }

    async findWithExercises(planId: string): Promise<TrainingPlan | undefined> {
        const plan = await this.findOne({
            where: { plan_id: planId },
            relations: ["trainer", "planExercises", "planExercises.exercise"]
        });
        return plan || undefined;
    }
} 