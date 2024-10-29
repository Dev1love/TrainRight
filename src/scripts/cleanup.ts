import 'dotenv/config';
import { AppDataSource } from '../config/database';
import { WorkoutProgress } from '../models/WorkoutProgress';
import { ClientWorkout } from '../models/ClientWorkout';
import { PlanExercise } from '../models/PlanExercise';
import { TrainerClientRelationship } from '../models/TrainerClientRelationship';
import { TrainingPlan } from '../models/TrainingPlan';
import { Exercise } from '../models/Exercise';
import { Feedback } from '../models/Feedback';
import { User } from '../models/User';

async function cleanup() {
    try {
        await AppDataSource.initialize();
        console.log('Database connected');

        // Delete data in the correct order to respect foreign key constraints
        console.log('Cleaning up database...');

        // First, delete dependent records
        await AppDataSource.getRepository(WorkoutProgress).delete({});
        console.log('✓ Deleted workout progress records');

        await AppDataSource.getRepository(Feedback).delete({});
        console.log('✓ Deleted feedback records');

        await AppDataSource.getRepository(ClientWorkout).delete({});
        console.log('✓ Deleted client workout records');

        await AppDataSource.getRepository(PlanExercise).delete({});
        console.log('✓ Deleted plan exercise records');

        await AppDataSource.getRepository(TrainerClientRelationship).delete({});
        console.log('✓ Deleted trainer-client relationships');

        // Then delete independent records
        await AppDataSource.getRepository(TrainingPlan).delete({});
        console.log('✓ Deleted training plans');

        await AppDataSource.getRepository(Exercise).delete({});
        console.log('✓ Deleted exercises');

        await AppDataSource.getRepository(User).delete({});
        console.log('✓ Deleted users');

        console.log('\nDatabase cleanup completed successfully');

    } catch (error) {
        console.error('Error cleaning up database:', error);
    } finally {
        await AppDataSource.destroy();
    }
}

// Add confirmation prompt if running directly
if (require.main === module) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.question('This will delete ALL data from the database. Are you sure? (yes/no) ', async (answer: string) => {
        if (answer.toLowerCase() === 'yes') {
            await cleanup();
        } else {
            console.log('Cleanup cancelled');
        }
        readline.close();
        process.exit(0);
    });
} else {
    // Export for programmatic use
    module.exports = cleanup;
} 