import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TrainRight API',
      version: '1.0.0',
      description: 'API documentation for TrainRight fitness application',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            user_id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['client', 'trainer', 'admin'] },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        TrainingPlan: {
          type: 'object',
          properties: {
            plan_id: { type: 'string', format: 'uuid' },
            plan_name: { type: 'string' },
            description: { type: 'string' },
            trainer: { $ref: '#/components/schemas/User' },
            planExercises: {
              type: 'array',
              items: { $ref: '#/components/schemas/PlanExercise' }
            },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        TrainerClientRelationship: {
          type: 'object',
          properties: {
            relationship_id: { type: 'string', format: 'uuid' },
            trainer: { $ref: '#/components/schemas/User' },
            client: { $ref: '#/components/schemas/User' },
            status: { 
              type: 'string',
              enum: ['pending', 'active', 'terminated']
            },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        ClientWorkout: {
          type: 'object',
          properties: {
            workout_id: { type: 'string', format: 'uuid' },
            client: { $ref: '#/components/schemas/User' },
            plan: { $ref: '#/components/schemas/TrainingPlan' },
            status: {
              type: 'string',
              enum: ['in_progress', 'completed']
            },
            started_at: { type: 'string', format: 'date-time' },
            completed_at: { type: 'string', format: 'date-time' },
            workoutProgress: {
              type: 'array',
              items: { $ref: '#/components/schemas/WorkoutProgress' }
            }
          }
        },
        WorkoutProgress: {
          type: 'object',
          properties: {
            progress_id: { type: 'string', format: 'uuid' },
            workout: { $ref: '#/components/schemas/ClientWorkout' },
            exercise: { $ref: '#/components/schemas/Exercise' },
            completed_sets: { type: 'integer', minimum: 0 },
            completed_reps: { type: 'integer', minimum: 0 },
            weight: { type: 'number', format: 'float' },
            notes: { type: 'string' },
            recorded_at: { type: 'string', format: 'date-time' }
          }
        },
        PlanExercise: {
          type: 'object',
          properties: {
            plan_exercise_id: { type: 'string', format: 'uuid' },
            exercise: { $ref: '#/components/schemas/Exercise' },
            order: { type: 'integer', minimum: 1 },
            sets: { type: 'integer', minimum: 1 },
            reps: { type: 'integer', minimum: 1 },
            weight_recommendation: { type: 'string' }
          }
        },
        Exercise: {
          type: 'object',
          properties: {
            exercise_id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            muscle_group: { type: 'string' },
            equipment_required: { type: 'string' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        ValidationError: {
          description: 'Invalid input data',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        }
      }
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

export const specs = swaggerJsdoc(options);