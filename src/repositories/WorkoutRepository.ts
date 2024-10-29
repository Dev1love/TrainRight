import { Repository, EntityManager, DataSource } from "typeorm";
import { ClientWorkout } from "../models/ClientWorkout";
import { Between } from "typeorm";

export class WorkoutRepository extends Repository<ClientWorkout> {
    constructor(dataSourceOrManager?: DataSource | EntityManager) {
        if (dataSourceOrManager instanceof DataSource) {
            super(ClientWorkout, dataSourceOrManager.createEntityManager());
        } else if (dataSourceOrManager instanceof EntityManager) {
            super(ClientWorkout, dataSourceOrManager);
        } else {
            super(ClientWorkout, new EntityManager({
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

    async findClientWorkouts(clientId: string): Promise<ClientWorkout[]> {
        return this.find({
            where: { client: { user_id: clientId } },
            relations: ["plan", "plan.trainer"]
        });
    }

    async findWorkoutWithProgress(workoutId: string): Promise<ClientWorkout | undefined> {
        const workout = await this.findOne({
            where: { workout_id: workoutId },
            relations: ["plan", "workoutProgress", "workoutProgress.exercise"]
        });
        return workout || undefined;
    }

    async findWorkoutsByDateRange(clientId: string, startDate: Date, endDate: Date): Promise<ClientWorkout[]> {
        return this.find({
            where: {
                client: { user_id: clientId },
                start_time: Between(startDate, endDate)
            },
            relations: ["plan"]
        });
    }
} 