import { TrainingPlan } from "../../models/TrainingPlan";
import { TrainingPlanRepository } from "../../repositories/TrainingPlanRepository";
import { FindOneOptions, DeepPartial, EntityManager, DataSource } from "typeorm";
import { PlanExercise } from "../../models/PlanExercise";

export class MockTrainingPlanRepository extends TrainingPlanRepository {
    private plans: TrainingPlan[] = [];
    private planExercises: PlanExercise[] = [];

    constructor() {
        // Create a minimal manager for testing
        const manager = new EntityManager({
            "@instanceof": Symbol.for("DataSource"),
            options: {},
            manager: undefined as any,
            name: "default",
            isInitialized: true,
            driver: {
                options: {},
                isInitialized: true,
            } as any,
        } as DataSource);
        
        super(manager);
        Object.setPrototypeOf(this, MockTrainingPlanRepository.prototype);
    }

    async findByTrainer(trainerId: string): Promise<TrainingPlan[]> {
        return this.plans.filter(plan => plan.trainer.user_id === trainerId);
    }

    async findOne(options: FindOneOptions<TrainingPlan>): Promise<TrainingPlan | null> {
        if (options.where && typeof options.where === 'object') {
            const where = options.where as any;
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
    }

    async save<T extends DeepPartial<TrainingPlan>>(entityOrEntities: T | T[]): Promise<T | T[]> {
        if (Array.isArray(entityOrEntities)) {
            return entityOrEntities.map(entity => this.saveOne(entity as TrainingPlan)) as T[];
        }
        return this.saveOne(entityOrEntities as TrainingPlan) as T;
    }

    private saveOne(plan: TrainingPlan): TrainingPlan {
        const existingPlanIndex = this.plans.findIndex(p => p.plan_id === plan.plan_id);
        if (existingPlanIndex >= 0) {
            this.plans[existingPlanIndex] = plan;
            return plan;
        }
        
        const newPlan = {
            ...plan,
            plan_id: String(this.plans.length + 1),
            created_at: new Date(),
            updated_at: new Date()
        };
        this.plans.push(newPlan);

        // Save associated exercises if they exist
        if (plan.planExercises) {
            plan.planExercises.forEach(exercise => {
                this.planExercises.push({
                    ...exercise,
                    plan_exercise_id: String(this.planExercises.length + 1),
                    plan: newPlan
                });
            });
        }

        return newPlan;
    }

    create(): TrainingPlan;
    create(entityLike: DeepPartial<TrainingPlan>): TrainingPlan;
    create(entityLikeArray: DeepPartial<TrainingPlan>[]): TrainingPlan[];
    create(entityLike?: DeepPartial<TrainingPlan> | DeepPartial<TrainingPlan>[]): TrainingPlan | TrainingPlan[] {
        if (!entityLike) {
            return this.createOne({});
        }
        if (Array.isArray(entityLike)) {
            return entityLike.map(data => this.createOne(data));
        }
        return this.createOne(entityLike);
    }

    private createOne(entityLike: DeepPartial<TrainingPlan>): TrainingPlan {
        return {
            plan_id: String(this.plans.length + 1),
            plan_name: entityLike.plan_name || '',
            description: entityLike.description || '',
            trainer: entityLike.trainer || null,
            planExercises: entityLike.planExercises || [],
            created_at: new Date(),
            updated_at: new Date()
        } as TrainingPlan;
    }

    async clear(): Promise<void> {
        this.plans = [];
        this.planExercises = [];
    }
} 