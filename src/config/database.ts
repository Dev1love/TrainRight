import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../models/User';
import { TrainingPlan } from '../models/TrainingPlan';
import { PlanExercise } from '../models/PlanExercise';
import { Exercise } from '../models/Exercise';
import { ClientWorkout } from '../models/ClientWorkout';
import { WorkoutProgress } from '../models/WorkoutProgress';
import { TrainerClientRelationship } from '../models/TrainerClientRelationship';
import { Feedback } from '../models/Feedback';

// More detailed logging
const dbConfig: DataSourceOptions = {
  type: 'postgres' as const,  // Explicitly specify the type
  host: process.env.DB_HOST || 'db',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.POSTGRES_USER || 'user',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB || 'trainright',
  synchronize: true,
  logging: true,
  entities: [
    User,
    TrainingPlan,
    PlanExercise,
    Exercise,
    ClientWorkout,
    WorkoutProgress,
    TrainerClientRelationship,
    Feedback
  ],
  migrations: [],
  subscribers: []
};

console.log('Environment variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('POSTGRES_USER:', process.env.POSTGRES_USER);
console.log('POSTGRES_DB:', process.env.POSTGRES_DB);
console.log('NODE_ENV:', process.env.NODE_ENV);

console.log('Final database config:', {
  ...dbConfig,
  password: '***'
});

export const AppDataSource = new DataSource(dbConfig); 