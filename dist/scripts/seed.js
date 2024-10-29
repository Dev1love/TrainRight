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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const database_1 = require("../config/database");
const User_1 = require("../models/User");
const Exercise_1 = require("../models/Exercise");
const TrainingPlan_1 = require("../models/TrainingPlan");
const PlanExercise_1 = require("../models/PlanExercise");
const TrainerClientRelationship_1 = require("../models/TrainerClientRelationship");
const ClientWorkout_1 = require("../models/ClientWorkout");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.AppDataSource.initialize();
            console.log('Database connected');
            // Create users
            const passwordHash = yield bcryptjs_1.default.hash('password123', 10);
            const trainer = yield database_1.AppDataSource.getRepository(User_1.User).save({
                name: 'John Trainer',
                email: 'trainer@example.com',
                password_hash: passwordHash,
                role: 'trainer'
            });
            const client1 = yield database_1.AppDataSource.getRepository(User_1.User).save({
                name: 'Alice Client',
                email: 'client1@example.com',
                password_hash: passwordHash,
                role: 'client'
            });
            const client2 = yield database_1.AppDataSource.getRepository(User_1.User).save({
                name: 'Bob Client',
                email: 'client2@example.com',
                password_hash: passwordHash,
                role: 'client'
            });
            const admin = yield database_1.AppDataSource.getRepository(User_1.User).save({
                name: 'Admin User',
                email: 'admin@example.com',
                password_hash: passwordHash,
                role: 'admin'
            });
            // Create exercises
            const exercises = yield database_1.AppDataSource.getRepository(Exercise_1.Exercise).save([
                {
                    name: 'Push-ups',
                    description: 'Basic push-up movement',
                    default_rest_time: 60,
                    video_url: 'https://example.com/pushup.mp4'
                },
                {
                    name: 'Squats',
                    description: 'Basic squat movement',
                    default_rest_time: 90,
                    video_url: 'https://example.com/squat.mp4'
                },
                {
                    name: 'Pull-ups',
                    description: 'Basic pull-up movement',
                    default_rest_time: 120,
                    video_url: 'https://example.com/pullup.mp4'
                },
                {
                    name: 'Deadlift',
                    description: 'Basic deadlift movement',
                    default_rest_time: 120,
                    video_url: 'https://example.com/deadlift.mp4'
                },
                {
                    name: 'Bench Press',
                    description: 'Basic bench press movement',
                    default_rest_time: 90,
                    video_url: 'https://example.com/bench.mp4'
                }
            ]);
            // Create training plans
            const beginnerPlan = yield database_1.AppDataSource.getRepository(TrainingPlan_1.TrainingPlan).save({
                plan_name: 'Beginner Workout Plan',
                description: 'A basic workout plan for beginners',
                trainer: trainer
            });
            const intermediatePlan = yield database_1.AppDataSource.getRepository(TrainingPlan_1.TrainingPlan).save({
                plan_name: 'Intermediate Workout Plan',
                description: 'A challenging workout plan for intermediate users',
                trainer: trainer
            });
            // Add exercises to plans
            yield database_1.AppDataSource.getRepository(PlanExercise_1.PlanExercise).save([
                {
                    plan: beginnerPlan,
                    exercise: exercises[0], // Push-ups
                    order: 1,
                    sets: 3,
                    reps: 10,
                    weight_recommendation: 'Bodyweight'
                },
                {
                    plan: beginnerPlan,
                    exercise: exercises[1], // Squats
                    order: 2,
                    sets: 3,
                    reps: 15,
                    weight_recommendation: 'Bodyweight'
                },
                {
                    plan: intermediatePlan,
                    exercise: exercises[3], // Deadlift
                    order: 1,
                    sets: 4,
                    reps: 8,
                    weight_recommendation: '60-80% of 1RM'
                },
                {
                    plan: intermediatePlan,
                    exercise: exercises[4], // Bench Press
                    order: 2,
                    sets: 4,
                    reps: 10,
                    weight_recommendation: '70% of 1RM'
                }
            ]);
            // Create trainer-client relationships
            yield database_1.AppDataSource.getRepository(TrainerClientRelationship_1.TrainerClientRelationship).save([
                {
                    trainer: trainer,
                    client: client1,
                    status: 'active'
                },
                {
                    trainer: trainer,
                    client: client2,
                    status: 'pending'
                }
            ]);
            // Create some workouts
            yield database_1.AppDataSource.getRepository(ClientWorkout_1.ClientWorkout).save([
                {
                    client: client1,
                    plan: beginnerPlan,
                    status: 'completed',
                    start_time: new Date(Date.now() - 7200000), // 2 hours ago
                    end_time: new Date(Date.now() - 3600000) // 1 hour ago
                },
                {
                    client: client1,
                    plan: beginnerPlan,
                    status: 'in_progress',
                    start_time: new Date()
                }
            ]);
            console.log('Seed data created successfully');
            console.log('\nTest Credentials:');
            console.log('Trainer: trainer@example.com / password123');
            console.log('Client 1: client1@example.com / password123');
            console.log('Client 2: client2@example.com / password123');
            console.log('Admin: admin@example.com / password123');
        }
        catch (error) {
            console.error('Error seeding database:', error);
        }
        finally {
            yield database_1.AppDataSource.destroy();
        }
    });
}
seed();
