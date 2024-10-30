import 'reflect-metadata';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import router from './routes/api';
import { errorHandler } from './middleware/errorHandler';
import cors from 'cors';

const app = express();

// Development CORS configuration
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['set-cookie']
}));

app.use(express.json());

// API routes should come before Swagger
app.use('/api', router);

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Error handling middleware should be last
app.use(errorHandler);

export { app }; 