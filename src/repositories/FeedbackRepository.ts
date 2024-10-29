import { EntityRepository, Repository } from "typeorm";
import { Feedback } from "../models/Feedback";

@EntityRepository(Feedback)
export class FeedbackRepository extends Repository<Feedback> {
    async findWorkoutFeedback(workoutId: string): Promise<Feedback[]> {
        return this.find({
            where: { workout: { workout_id: workoutId } },
            relations: ["user"],
            order: { created_at: "DESC" }
        });
    }

    async findClientFeedback(clientId: string): Promise<Feedback[]> {
        return this.find({
            where: { workout: { client: { user_id: clientId } } },
            relations: ["user", "workout"],
            order: { created_at: "DESC" }
        });
    }
} 