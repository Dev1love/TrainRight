"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TrainingPlanService_1 = require("../../services/TrainingPlanService");
const MockTrainingPlanRepository_1 = require("../mocks/MockTrainingPlanRepository");
describe('TrainingPlanService', () => {
    let trainingPlanService;
    let trainingPlanRepository;
    beforeEach(() => {
        trainingPlanRepository = new MockTrainingPlanRepository_1.MockTrainingPlanRepository();
        trainingPlanService = new TrainingPlanService_1.TrainingPlanService(trainingPlanRepository);
    });
    describe('createPlan', () => {
        const validPlanData = {
            plan_name: 'Beginner Workout Plan',
            description: 'A basic workout plan for beginners',
            exercises: [
                {
                    exercise_id: '1',
                    order: 1,
                    sets: 3,
                    reps: 10,
                    weight_recommendation: '10-15 kg'
                },
                {
                    exercise_id: '2',
                    order: 2,
                    sets: 4,
                    reps: 12,
                    weight_recommendation: 'bodyweight'
                }
            ]
        };
        it('should create a training plan successfully', async () => {
            const trainerId = 'trainer-1';
            const plan = await trainingPlanService.createPlan(trainerId, validPlanData);
            expect(plan).toHaveProperty('plan_id');
            expect(plan.plan_name).toBe(validPlanData.plan_name);
            expect(plan.description).toBe(validPlanData.description);
            expect(plan.trainer.user_id).toBe(trainerId);
            expect(plan.planExercises).toHaveLength(2);
            expect(plan.planExercises[0].order).toBe(1);
            expect(plan.planExercises[1].order).toBe(2);
        });
        it('should validate plan name length', async () => {
            const invalidPlanData = Object.assign(Object.assign({}, validPlanData), { plan_name: '' });
            await expect(trainingPlanService.createPlan('trainer-1', invalidPlanData))
                .rejects
                .toThrow('Plan name is required');
        });
        it('should validate exercises array', async () => {
            const invalidPlanData = Object.assign(Object.assign({}, validPlanData), { exercises: [] });
            await expect(trainingPlanService.createPlan('trainer-1', invalidPlanData))
                .rejects
                .toThrow('At least one exercise is required');
        });
        it('should validate exercise order', async () => {
            const invalidPlanData = Object.assign(Object.assign({}, validPlanData), { exercises: [
                    Object.assign(Object.assign({}, validPlanData.exercises[0]), { order: 0 })
                ] });
            await expect(trainingPlanService.createPlan('trainer-1', invalidPlanData))
                .rejects
                .toThrow('Exercise order must be positive');
        });
        it('should validate exercise sets and reps', async () => {
            const invalidPlanData = Object.assign(Object.assign({}, validPlanData), { exercises: [
                    Object.assign(Object.assign({}, validPlanData.exercises[0]), { sets: 0, reps: -1 })
                ] });
            await expect(trainingPlanService.createPlan('trainer-1', invalidPlanData))
                .rejects
                .toThrow('Sets and reps must be positive');
        });
        it('should validate unique exercise order', async () => {
            const invalidPlanData = Object.assign(Object.assign({}, validPlanData), { exercises: [
                    {
                        exercise_id: '1',
                        order: 1,
                        sets: 3,
                        reps: 10
                    },
                    {
                        exercise_id: '2',
                        order: 1,
                        sets: 4,
                        reps: 12
                    }
                ] });
            await expect(trainingPlanService.createPlan('trainer-1', invalidPlanData))
                .rejects
                .toThrow('Exercise orders must be unique');
        });
        it('should validate consecutive exercise order', async () => {
            const invalidPlanData = Object.assign(Object.assign({}, validPlanData), { exercises: [
                    {
                        exercise_id: '1',
                        order: 1,
                        sets: 3,
                        reps: 10
                    },
                    {
                        exercise_id: '2',
                        order: 3,
                        sets: 4,
                        reps: 12
                    }
                ] });
            await expect(trainingPlanService.createPlan('trainer-1', invalidPlanData))
                .rejects
                .toThrow('Exercise orders must be consecutive');
        });
    });
    describe('updatePlan', () => {
        let planId;
        beforeEach(async () => {
            const plan = await trainingPlanService.createPlan('trainer-1', {
                plan_name: 'Original Plan',
                description: 'Original description',
                exercises: [
                    {
                        exercise_id: '1',
                        order: 1,
                        sets: 3,
                        reps: 10
                    }
                ]
            });
            planId = plan.plan_id;
        });
        it('should update plan details', async () => {
            const updatedPlan = await trainingPlanService.updatePlan(planId, {
                plan_name: 'Updated Plan',
                description: 'Updated description'
            });
            expect(updatedPlan.plan_name).toBe('Updated Plan');
            expect(updatedPlan.description).toBe('Updated description');
        });
        it('should update plan exercises', async () => {
            const updatedPlan = await trainingPlanService.updatePlan(planId, {
                exercises: [
                    {
                        exercise_id: '2',
                        order: 1,
                        sets: 4,
                        reps: 12
                    }
                ]
            });
            expect(updatedPlan.planExercises).toHaveLength(1);
            expect(updatedPlan.planExercises[0].exercise.exercise_id).toBe('2');
        });
        it('should not update plan of non-existent ID', async () => {
            await expect(trainingPlanService.updatePlan('non-existent', {
                plan_name: 'Updated Plan'
            })).rejects.toThrow('Plan not found');
        });
    });
    describe('getTrainerPlans', () => {
        const trainerId = 'trainer-1';
        beforeEach(async () => {
            await trainingPlanService.createPlan(trainerId, {
                plan_name: 'Plan 1',
                description: 'Description 1',
                exercises: [
                    {
                        exercise_id: '1',
                        order: 1,
                        sets: 3,
                        reps: 10
                    }
                ]
            });
        });
        it('should return all plans for a trainer', async () => {
            const plans = await trainingPlanService.getTrainerPlans(trainerId);
            expect(plans).toHaveLength(1);
            expect(plans[0].trainer.user_id).toBe(trainerId);
        });
        it('should return empty array for trainer with no plans', async () => {
            const plans = await trainingPlanService.getTrainerPlans('other-trainer');
            expect(plans).toHaveLength(0);
        });
    });
    describe('getPlanDetails', () => {
        let planId;
        beforeEach(async () => {
            const plan = await trainingPlanService.createPlan('trainer-1', {
                plan_name: 'Test Plan',
                description: 'Test Description',
                exercises: [
                    {
                        exercise_id: '1',
                        order: 1,
                        sets: 3,
                        reps: 10
                    }
                ]
            });
            planId = plan.plan_id;
        });
        it('should return plan with exercises', async () => {
            const plan = await trainingPlanService.getPlanDetails(planId);
            expect(plan).toBeDefined();
            expect(plan === null || plan === void 0 ? void 0 : plan.plan_id).toBe(planId);
            expect(plan === null || plan === void 0 ? void 0 : plan.planExercises).toHaveLength(1);
        });
        it('should return undefined for non-existent plan', async () => {
            const plan = await trainingPlanService.getPlanDetails('non-existent');
            expect(plan).toBeUndefined();
        });
    });
});
//# sourceMappingURL=TrainingPlanService.test.js.map