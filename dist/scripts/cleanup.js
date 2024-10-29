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
require("dotenv/config");
const database_1 = require("../config/database");
const WorkoutProgress_1 = require("../models/WorkoutProgress");
const ClientWorkout_1 = require("../models/ClientWorkout");
const PlanExercise_1 = require("../models/PlanExercise");
const TrainerClientRelationship_1 = require("../models/TrainerClientRelationship");
const TrainingPlan_1 = require("../models/TrainingPlan");
const Exercise_1 = require("../models/Exercise");
const Feedback_1 = require("../models/Feedback");
const User_1 = require("../models/User");
function cleanup() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.AppDataSource.initialize();
            console.log('Database connected');
            // Delete data in the correct order to respect foreign key constraints
            console.log('Cleaning up database...');
            // First, delete dependent records
            yield database_1.AppDataSource.getRepository(WorkoutProgress_1.WorkoutProgress).delete({});
            console.log('✓ Deleted workout progress records');
            yield database_1.AppDataSource.getRepository(Feedback_1.Feedback).delete({});
            console.log('✓ Deleted feedback records');
            yield database_1.AppDataSource.getRepository(ClientWorkout_1.ClientWorkout).delete({});
            console.log('✓ Deleted client workout records');
            yield database_1.AppDataSource.getRepository(PlanExercise_1.PlanExercise).delete({});
            console.log('✓ Deleted plan exercise records');
            yield database_1.AppDataSource.getRepository(TrainerClientRelationship_1.TrainerClientRelationship).delete({});
            console.log('✓ Deleted trainer-client relationships');
            // Then delete independent records
            yield database_1.AppDataSource.getRepository(TrainingPlan_1.TrainingPlan).delete({});
            console.log('✓ Deleted training plans');
            yield database_1.AppDataSource.getRepository(Exercise_1.Exercise).delete({});
            console.log('✓ Deleted exercises');
            yield database_1.AppDataSource.getRepository(User_1.User).delete({});
            console.log('✓ Deleted users');
            console.log('\nDatabase cleanup completed successfully');
        }
        catch (error) {
            console.error('Error cleaning up database:', error);
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
    readline.question('This will delete ALL data from the database. Are you sure? (yes/no) ', (answer) => __awaiter(void 0, void 0, void 0, function* () {
        if (answer.toLowerCase() === 'yes') {
            yield cleanup();
        }
        else {
            console.log('Cleanup cancelled');
        }
        readline.close();
        process.exit(0);
    }));
}
else {
    // Export for programmatic use
    module.exports = cleanup;
}
