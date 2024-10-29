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
exports.TrainingPlanRepository = void 0;
const typeorm_1 = require("typeorm");
const TrainingPlan_1 = require("../models/TrainingPlan");
class TrainingPlanRepository extends typeorm_1.Repository {
    constructor(dataSourceOrManager) {
        if (dataSourceOrManager instanceof typeorm_1.DataSource) {
            super(TrainingPlan_1.TrainingPlan, dataSourceOrManager.createEntityManager());
        }
        else if (dataSourceOrManager instanceof typeorm_1.EntityManager) {
            super(TrainingPlan_1.TrainingPlan, dataSourceOrManager);
        }
        else {
            // For testing purposes, we'll create a minimal manager
            super(TrainingPlan_1.TrainingPlan, new typeorm_1.EntityManager({
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
    findByTrainer(trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.find({
                where: { trainer: { user_id: trainerId } },
                relations: ["trainer"]
            });
        });
    }
    findWithExercises(planId) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield this.findOne({
                where: { plan_id: planId },
                relations: ["trainer", "planExercises", "planExercises.exercise"]
            });
            return plan || undefined;
        });
    }
}
exports.TrainingPlanRepository = TrainingPlanRepository;
