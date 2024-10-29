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
exports.MockTrainingPlanRepository = void 0;
const TrainingPlanRepository_1 = require("../../repositories/TrainingPlanRepository");
const typeorm_1 = require("typeorm");
class MockTrainingPlanRepository extends TrainingPlanRepository_1.TrainingPlanRepository {
    constructor() {
        // Create a minimal manager for testing
        const manager = new typeorm_1.EntityManager({
            "@instanceof": Symbol.for("DataSource"),
            options: {},
            manager: undefined,
            name: "default",
            isInitialized: true,
            driver: {
                options: {},
                isInitialized: true,
            },
        });
        super(manager);
        this.plans = [];
        this.planExercises = [];
        Object.setPrototypeOf(this, MockTrainingPlanRepository.prototype);
    }
    findByTrainer(trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.plans.filter(plan => plan.trainer.user_id === trainerId);
        });
    }
    findOne(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options.where && typeof options.where === 'object') {
                const where = options.where;
                if (where.plan_id) {
                    const plan = this.plans.find(p => p.plan_id === where.plan_id);
                    if (plan && options.relations) {
                        const relations = Array.isArray(options.relations) ? options.relations : [options.relations];
                        if (relations.includes('planExercises')) {
                            plan.planExercises = this.planExercises.filter(pe => pe.plan.plan_id === plan.plan_id);
                        }
                    }
                    return plan || null;
                }
            }
            return null;
        });
    }
    save(entityOrEntities) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(entityOrEntities)) {
                return entityOrEntities.map(entity => this.saveOne(entity));
            }
            return this.saveOne(entityOrEntities);
        });
    }
    saveOne(plan) {
        const existingPlanIndex = this.plans.findIndex(p => p.plan_id === plan.plan_id);
        if (existingPlanIndex >= 0) {
            this.plans[existingPlanIndex] = plan;
            return plan;
        }
        const newPlan = Object.assign(Object.assign({}, plan), { plan_id: String(this.plans.length + 1), created_at: new Date(), updated_at: new Date() });
        this.plans.push(newPlan);
        // Save associated exercises if they exist
        if (plan.planExercises) {
            plan.planExercises.forEach(exercise => {
                this.planExercises.push(Object.assign(Object.assign({}, exercise), { plan_exercise_id: String(this.planExercises.length + 1), plan: newPlan }));
            });
        }
        return newPlan;
    }
    create(entityLike) {
        if (!entityLike) {
            return this.createOne({});
        }
        if (Array.isArray(entityLike)) {
            return entityLike.map(data => this.createOne(data));
        }
        return this.createOne(entityLike);
    }
    createOne(entityLike) {
        return {
            plan_id: String(this.plans.length + 1),
            plan_name: entityLike.plan_name || '',
            description: entityLike.description || '',
            trainer: entityLike.trainer || null,
            planExercises: entityLike.planExercises || [],
            created_at: new Date(),
            updated_at: new Date()
        };
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plans = [];
            this.planExercises = [];
        });
    }
}
exports.MockTrainingPlanRepository = MockTrainingPlanRepository;
