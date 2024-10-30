import { WorkoutRepository } from "../repositories/WorkoutRepository";
import { ClientWorkout } from "../models/ClientWorkout";
import { WorkoutProgress } from "../models/WorkoutProgress";
import { NotFoundError } from "../utils/errors";

interface ProgressData {
    exerciseId: string;
    completedSets: number;
    completedReps: number;
    weight?: number;
    notes?: string;
}

export class WorkoutService {
    constructor(
        private workoutRepository: WorkoutRepository
    ) {}

    async startWorkout(clientId: string, planId: string): Promise<ClientWorkout> {
        const workout = this.workoutRepository.create({
            client: { user_id: clientId },
            plan: { plan_id: planId },
            status: "in_progress",
            start_time: new Date()
        });

        return this.workoutRepository.save(workout);
    }

    async completeWorkout(workoutId: string): Promise<ClientWorkout> {
        const workout = await this.workoutRepository.findWorkoutWithProgress(workoutId);
        if (!workout) {
            throw new NotFoundError("Workout not found");
        }

        workout.status = "completed";
        workout.end_time = new Date();
        return this.workoutRepository.save(workout);
    }

    async getClientWorkouts(clientId: string, startDate?: Date, endDate?: Date): Promise<ClientWorkout[]> {
        if (startDate && endDate) {
            return this.workoutRepository.findWorkoutsByDateRange(clientId, startDate, endDate);
        }
        return this.workoutRepository.findClientWorkouts(clientId);
    }

    async recordProgress(workoutId: string, data: ProgressData): Promise<WorkoutProgress> {
        const workout = await this.workoutRepository.findWorkoutWithProgress(workoutId);
        if (!workout) {
            throw new NotFoundError("Workout not found");
        }

        // Implement the rest of the method...
        throw new Error("Not implemented");
    }
} 