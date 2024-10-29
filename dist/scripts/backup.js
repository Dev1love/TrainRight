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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function backup() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.AppDataSource.initialize();
            console.log('Database connected');
            const backupData = {
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
            backupData.users = yield database_1.AppDataSource.getRepository('User').find();
            console.log('✓ Users backed up');
            backupData.exercises = yield database_1.AppDataSource.getRepository('Exercise').find();
            console.log('✓ Exercises backed up');
            backupData.trainingPlans = yield database_1.AppDataSource.getRepository('TrainingPlan')
                .find({ relations: ['trainer'] });
            console.log('✓ Training plans backed up');
            backupData.planExercises = yield database_1.AppDataSource.getRepository('PlanExercise')
                .find({ relations: ['plan', 'exercise'] });
            console.log('✓ Plan exercises backed up');
            backupData.trainerClientRelationships = yield database_1.AppDataSource
                .getRepository('TrainerClientRelationship')
                .find({ relations: ['trainer', 'client'] });
            console.log('✓ Trainer-client relationships backed up');
            backupData.clientWorkouts = yield database_1.AppDataSource.getRepository('ClientWorkout')
                .find({ relations: ['client', 'plan'] });
            console.log('✓ Client workouts backed up');
            backupData.workoutProgress = yield database_1.AppDataSource.getRepository('WorkoutProgress')
                .find({ relations: ['workout', 'exercise'] });
            console.log('✓ Workout progress backed up');
            backupData.feedback = yield database_1.AppDataSource.getRepository('Feedback')
                .find({ relations: ['workout', 'user'] });
            console.log('✓ Feedback backed up');
            // Create backups directory if it doesn't exist
            const backupDir = path_1.default.join(__dirname, '../../backups');
            if (!fs_1.default.existsSync(backupDir)) {
                fs_1.default.mkdirSync(backupDir);
            }
            // Save backup file
            const filename = `backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
            const filepath = path_1.default.join(backupDir, filename);
            fs_1.default.writeFileSync(filepath, JSON.stringify(backupData, null, 2));
            console.log(`\nBackup completed successfully: ${filepath}`);
        }
        catch (error) {
            console.error('Error creating backup:', error);
        }
        finally {
            yield database_1.AppDataSource.destroy();
        }
    });
}
// Add confirmation prompt if running directly
if (require.main === module) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    readline.question('Create database backup? (yes/no) ', (answer) => __awaiter(void 0, void 0, void 0, function* () {
        if (answer.toLowerCase() === 'yes') {
            yield backup();
        }
        else {
            console.log('Backup cancelled');
        }
        readline.close();
        process.exit(0);
    }));
}
else {
    // Export for programmatic use
    module.exports = backup;
}
