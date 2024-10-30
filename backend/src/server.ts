import 'dotenv/config';
import { app } from './app';
import { AppDataSource } from './config/database';

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Initialize TypeORM connection
        await AppDataSource.initialize();
        console.log('Database connection established');

        // Start Express server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
        });
    } catch (error: unknown) {
        console.error('Error starting server:', error);
        if (error instanceof Error && 'code' in error && error.code === 'ECONNREFUSED') {
            console.error('Make sure PostgreSQL is running and credentials are correct');
            console.error('Check your database connection settings in .env file');
        }
        console.log('Database URL:', process.env.DATABASE_URL);
        process.exit(1);
    }
}

startServer(); 