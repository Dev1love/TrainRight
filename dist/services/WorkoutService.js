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
exports.WorkoutService = void 0;
const errors_1 = require("../utils/errors");
class WorkoutService {
    constructor(workoutRepository) {
        this.workoutRepository = workoutRepository;
    }
    startWorkout(clientId, planId) {
        return __awaiter(this, void 0, void 0, function* () {
            const workout = this.workoutRepository.create({
                client: { user_id: clientId },
                plan: { plan_id: planId },
                status: "in_progress",
                start_time: new Date()
            });
            return this.workoutRepository.save(workout);
        });
    }
    completeWorkout(workoutId) {
        return __awaiter(this, void 0, void 0, function* () {
            const workout = yield this.workoutRepository.findWorkoutWithProgress(workoutId);
            if (!workout) {
                throw new errors_1.NotFoundError("Workout not found");
            }
            workout.status = "completed";
            workout.end_time = new Date();
            return this.workoutRepository.save(workout);
        });
    }
    getClientWorkouts(clientId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (startDate && endDate) {
                return this.workoutRepository.findWorkoutsByDateRange(clientId, startDate, endDate);
            }
            return this.workoutRepository.findClientWorkouts(clientId);
        });
    }
    recordProgress(workoutId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const workout = yield this.workoutRepository.findWorkoutWithProgress(workoutId);
            if (!workout) {
                throw new errors_1.NotFoundError("Workout not found");
            }
            // Implement the rest of the method...
            throw new Error("Not implemented");
        });
    }
}
exports.WorkoutService = WorkoutService;
