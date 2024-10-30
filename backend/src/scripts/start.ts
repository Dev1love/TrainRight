import 'dotenv/config';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function start() {
    try {
        // Run migrations and seed
        console.log('Running seed script...');
        await execAsync('npx ts-node src/scripts/seed.ts');
        
        // Start the application
        console.log('Starting application...');
        await execAsync('npm start');
    } catch (error) {
        console.error('Error during startup:', error);
        process.exit(1);
    }
}

start(); 