import 'dotenv/config';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Exercise } from '../models/Exercise';
import { TrainingPlan } from '../models/TrainingPlan';
import { PlanExercise } from '../models/PlanExercise';
import { TrainerClientRelationship } from '../models/TrainerClientRelationship';
import { ClientWorkout } from '../models/ClientWorkout';
import bcrypt from 'bcryptjs';

async function seed() {
    try {
        await AppDataSource.initialize();
        console.log('Database connected');

        // Create users
        const passwordHash = await bcrypt.hash('password123', 10);
        
        const trainer = await AppDataSource.getRepository(User).save({
            name: 'John Trainer',
            email: 'trainer@example.com',
            password_hash: passwordHash,
            role: 'trainer'
        });

        const client1 = await AppDataSource.getRepository(User).save({
            name: 'Alice Client',
            email: 'client1@example.com',
            password_hash: passwordHash,
            role: 'client'
        });

        const client2 = await AppDataSource.getRepository(User).save({
            name: 'Bob Client',
            email: 'client2@example.com',
            password_hash: passwordHash,
            role: 'client'
        });

        const admin = await AppDataSource.getRepository(User).save({
            name: 'Admin User',
            email: 'admin@example.com',
            password_hash: passwordHash,
            role: 'admin'
        });

        // Create exercises
        const exercises = await AppDataSource.getRepository(Exercise).save([
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
        const beginnerPlan = await AppDataSource.getRepository(TrainingPlan).save({
            plan_name: 'Beginner Workout Plan',
            description: 'A basic workout plan for beginners',
            trainer: trainer
        });

        const intermediatePlan = await AppDataSource.getRepository(TrainingPlan).save({
            plan_name: 'Intermediate Workout Plan',
            description: 'A challenging workout plan for intermediate users',
            trainer: trainer
        });

        // Add exercises to plans
        await AppDataSource.getRepository(PlanExercise).save([
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
        await AppDataSource.getRepository(TrainerClientRelationship).save([
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
        await AppDataSource.getRepository(ClientWorkout).save([
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

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await AppDataSource.destroy();
    }
}

seed(); 