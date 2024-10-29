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
exports.WorkoutRepository = void 0;
const typeorm_1 = require("typeorm");
const ClientWorkout_1 = require("../models/ClientWorkout");
const typeorm_2 = require("typeorm");
class WorkoutRepository extends typeorm_1.Repository {
    constructor(dataSourceOrManager) {
        if (dataSourceOrManager instanceof typeorm_1.DataSource) {
            super(ClientWorkout_1.ClientWorkout, dataSourceOrManager.createEntityManager());
        }
        else if (dataSourceOrManager instanceof typeorm_1.EntityManager) {
            super(ClientWorkout_1.ClientWorkout, dataSourceOrManager);
        }
        else {
            super(ClientWorkout_1.ClientWorkout, new typeorm_1.EntityManager({
                "@instanceof": Symbol.for("DataSource"),
                options: {},
                manager: undefined,
                name: "default",
                isInitialized: true,
                driver: {
                    options: {},
                    isInitialized: true,
                },
            }));
        }
    }
    findClientWorkouts(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.find({
                where: { client: { user_id: clientId } },
                relations: ["plan", "plan.trainer"]
            });
        });
    }
    findWorkoutWithProgress(workoutId) {
        return __awaiter(this, void 0, void 0, function* () {
            const workout = yield this.findOne({
                where: { workout_id: workoutId },
                relations: ["plan", "workoutProgress", "workoutProgress.exercise"]
            });
            return workout || undefined;
        });
    }
    findWorkoutsByDateRange(clientId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.find({
                where: {
                    client: { user_id: clientId },
                    start_time: (0, typeorm_2.Between)(startDate, endDate)
                },
                relations: ["plan"]
            });
        });
    }
}
exports.WorkoutRepository = WorkoutRepository;
