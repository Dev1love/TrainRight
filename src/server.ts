import 'dotenv/config';
import { AppDataSource } from './config/database';
// ... rest of your imports

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully');
    // ... rest of your server startup code
  } catch (error) {
    console.error('Error starting server:', error);
    console.log('Database URL:', process.env.DATABASE_URL);
  }
};

startServer(); 