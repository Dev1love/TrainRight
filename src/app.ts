import 'reflect-metadata';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import router from './routes/api';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api', router);

// Error handling middleware should be last
app.use(errorHandler);

export { app }; 