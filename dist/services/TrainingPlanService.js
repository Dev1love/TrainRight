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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingPlanService = void 0;
class TrainingPlanService {
    constructor(trainingPlanRepository) {
        this.trainingPlanRepository = trainingPlanRepository;
    }
    createPlan(trainerId, planData) {
        return __awaiter(this, void 0, void 0, function* () {
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
                }))
            });
            return this.trainingPlanRepository.save(plan);
        });
    }
    updatePlan(planId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield this.trainingPlanRepository.findOne({
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
                }));
            }
            return this.trainingPlanRepository.save(plan);
        });
    }
    getTrainerPlans(trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.trainingPlanRepository.findByTrainer(trainerId);
        });
    }
    getPlanDetails(planId) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield this.trainingPlanRepository.findOne({
                where: { plan_id: planId },
                relations: ["trainer", "planExercises", "planExercises.exercise"]
            });
            return plan || undefined;
        });
    }
    validateExercises(exercises) {
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
exports.TrainingPlanService = TrainingPlanService;
