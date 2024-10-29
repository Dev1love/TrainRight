"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../models/User");
const TrainingPlan_1 = require("../models/TrainingPlan");
const PlanExercise_1 = require("../models/PlanExercise");
const Exercise_1 = require("../models/Exercise");
const ClientWorkout_1 = require("../models/ClientWorkout");
const WorkoutProgress_1 = require("../models/WorkoutProgress");
const TrainerClientRelationship_1 = require("../models/TrainerClientRelationship");
const Feedback_1 = require("../models/Feedback");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'trainright',
    entities: [
        User_1.User,
        TrainingPlan_1.TrainingPlan,
        PlanExercise_1.PlanExercise,
        Exercise_1.Exercise,
        ClientWorkout_1.ClientWorkout,
        WorkoutProgress_1.WorkoutProgress,
        TrainerClientRelationship_1.TrainerClientRelationship,
        Feedback_1.Feedback
    ],
    synchronize: process.env.NODE_ENV !== 'production', // Don't use synchronize in production
    logging: process.env.NODE_ENV !== 'production'
});
