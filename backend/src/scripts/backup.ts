import 'dotenv/config';
import { AppDataSource } from '../config/database';
import fs from 'fs';
import path from 'path';

interface BackupData {
    users: any[];
    exercises: any[];
    trainingPlans: any[];
    planExercises: any[];
    trainerClientRelationships: any[];
    clientWorkouts: any[];
    workoutProgress: any[];
    feedback: any[];
    timestamp: string;
    version: string;
}

async function backup() {
    try {
        await AppDataSource.initialize();
        console.log('Database connected');

        const backupData: BackupData = {
            users: [],
            exercises: [],
            trainingPlans: [],
            planExercises: [],
            trainerClientRelationships: [],
            clientWorkouts: [],
            workoutProgress: [],
            feedback: [],
            timestamp: new Date().toISOString(),
            version: '1.0'
        };

        // Fetch all data
        console.log('Backing up data...');
        
        backupData.users = await AppDataSource.getRepository('User').find();
        console.log('✓ Users backed up');

        backupData.exercises = await AppDataSource.getRepository('Exercise').find();
        console.log('✓ Exercises backed up');

        backupData.trainingPlans = await AppDataSource.getRepository('TrainingPlan')
            .find({ relations: ['trainer'] });
        console.log('✓ Training plans backed up');

        backupData.planExercises = await AppDataSource.getRepository('PlanExercise')
            .find({ relations: ['plan', 'exercise'] });
        console.log('✓ Plan exercises backed up');

        backupData.trainerClientRelationships = await AppDataSource
            .getRepository('TrainerClientRelationship')
            .find({ relations: ['trainer', 'client'] });
        console.log('✓ Trainer-client relationships backed up');

        backupData.clientWorkouts = await AppDataSource.getRepository('ClientWorkout')
            .find({ relations: ['client', 'plan'] });
        console.log('✓ Client workouts backed up');

        backupData.workoutProgress = await AppDataSource.getRepository('WorkoutProgress')
            .find({ relations: ['workout', 'exercise'] });
        console.log('✓ Workout progress backed up');

        backupData.feedback = await AppDataSource.getRepository('Feedback')
            .find({ relations: ['workout', 'user'] });
        console.log('✓ Feedback backed up');

        // Create backups directory if it doesn't exist
        const backupDir = path.join(__dirname, '../../backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir);
        }

        // Save backup file
        const filename = `backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
        const filepath = path.join(backupDir, filename);
        fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2));

        console.log(`\nBackup completed successfully: ${filepath}`);

    } catch (error) {
        console.error('Error creating backup:', error);
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

    readline.question('Create database backup? (yes/no) ', async (answer: string) => {
        if (answer.toLowerCase() === 'yes') {
            await backup();
        } else {
            console.log('Backup cancelled');
        }
        readline.close();
        process.exit(0);
    });
} else {
    // Export for programmatic use
    module.exports = backup;
} 