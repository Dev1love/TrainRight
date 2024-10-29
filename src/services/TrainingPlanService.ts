import { TrainingPlanRepository } from "../repositories/TrainingPlanRepository";
import { TrainingPlan } from "../models/TrainingPlan";
import { PlanExercise } from "../models/PlanExercise";

interface ExerciseData {
    exercise_id: string;
    order: number;
    sets: number;
    reps: number;
    weight_recommendation?: string;
}

interface PlanData {
    plan_name: string;
    description: string;
    exercises: ExerciseData[];
}

interface UpdatePlanData {
    plan_name?: string;
    description?: string;
    exercises?: ExerciseData[];
}

export class TrainingPlanService {
    constructor(private trainingPlanRepository: TrainingPlanRepository) {}

    async createPlan(trainerId: string, planData: PlanData): Promise<TrainingPlan> {
        // Validate plan name
        if (!planData.plan_name.trim()) {
            throw new Error("Plan name is required");
        }

        // Validate exercises
        if (!planData.exercises.length) {
            throw new Error("At least one exercise is required");
        }

        // Validate exercise data
        this.validateExercises(planData.exercises);

        // Create plan
        const plan = this.trainingPlanRepository.create({
            plan_name: planData.plan_name,
            description: planData.description,
            trainer: { user_id: trainerId },
            planExercises: planData.exercises.map(exercise => ({
                exercise: { exercise_id: exercise.exercise_id },
                order: exercise.order,
                sets: exercise.sets,
                reps: exercise.reps,
                weight_recommendation: exercise.weight_recommendation
            })) as PlanExercise[]
        });

        return this.trainingPlanRepository.save(plan);
    }

    async updatePlan(planId: string, updateData: UpdatePlanData): Promise<TrainingPlan> {
        const plan = await this.trainingPlanRepository.findOne({
            where: { plan_id: planId },
            relations: ["planExercises"]
        });

        if (!plan) {
            throw new Error("Plan not found");
        }

        if (updateData.plan_name !== undefined) {
            plan.plan_name = updateData.plan_name;
        }

        if (updateData.description !== undefined) {
            plan.description = updateData.description;
        }

        if (updateData.exercises) {
            this.validateExercises(updateData.exercises);
            plan.planExercises = updateData.exercises.map(exercise => ({
                exercise: { exercise_id: exercise.exercise_id },
                order: exercise.order,
                sets: exercise.sets,
                reps: exercise.reps,
                weight_recommendation: exercise.weight_recommendation,
                plan: plan
            })) as PlanExercise[];
        }

        return this.trainingPlanRepository.save(plan);
    }

    async getTrainerPlans(trainerId: string): Promise<TrainingPlan[]> {
        return this.trainingPlanRepository.findByTrainer(trainerId);
    }

    async getPlanDetails(planId: string): Promise<TrainingPlan | undefined> {
        const plan = await this.trainingPlanRepository.findOne({
            where: { plan_id: planId },
            relations: ["trainer", "planExercises", "planExercises.exercise"]
        });
        return plan || undefined;
    }

    private validateExercises(exercises: ExerciseData[]): void {
        // Validate individual exercises
        exercises.forEach(exercise => {
            if (exercise.order <= 0) {
                throw new Error("Exercise order must be positive");
            }
            if (exercise.sets <= 0 || exercise.reps <= 0) {
                throw new Error("Sets and reps must be positive");
            }
        });

        // Check for unique orders
        const orders = exercises.map(e => e.order);
        if (new Set(orders).size !== orders.length) {
            throw new Error("Exercise orders must be unique");
        }

        // Check for consecutive orders
        const sortedOrders = [...orders].sort((a, b) => a - b);
        for (let i = 0; i < sortedOrders.length - 1; i++) {
            if (sortedOrders[i + 1] - sortedOrders[i] !== 1) {
                throw new Error("Exercise orders must be consecutive");
            }
        }
    }
} 