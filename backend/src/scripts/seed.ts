import 'dotenv/config';
import { Client } from 'pg';
import bcrypt from 'bcryptjs';

async function seed() {
    const client = new Client({
        host: process.env.DB_HOST || 'db',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.POSTGRES_USER || 'user',
        password: process.env.POSTGRES_PASSWORD || 'password',
        database: process.env.POSTGRES_DB || 'trainright'
    });

    try {
        await client.connect();
        console.log('Database connection initialized');

        // Check if users already exist
        const existingUsers = await client.query(
            'SELECT COUNT(*) FROM users WHERE email IN ($1, $2, $3)',
            ['trainer@example.com', 'client1@example.com', 'admin@example.com']
        );

        if (parseInt(existingUsers.rows[0].count) > 0) {
            console.log('Initial users already exist, skipping seed');
            await client.end();
            return;
        }

        // Generate password hash
        console.log('Generating password hash...');
        const plainPassword = 'password123';
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        // Insert initial users
        const insertQuery = `
            INSERT INTO users (name, email, password, role, created_at, updated_at)
            VALUES 
            ($1, $2, $3, $4, NOW(), NOW()),
            ($5, $6, $7, $8, NOW(), NOW()),
            ($9, $10, $11, $12, NOW(), NOW())
            RETURNING *;
        `;

        const values = [
            'John Trainer', 'trainer@example.com', hashedPassword, 'trainer',
            'Jane Client', 'client1@example.com', hashedPassword, 'client',
            'Admin User', 'admin@example.com', hashedPassword, 'admin'
        ];

        console.log('Creating initial users...');
        const result = await client.query(insertQuery, values);
        console.log('Initial users created:', result.rows.length);
        console.log('Seed credentials:');
        console.log('Trainer: trainer@example.com / password123');
        console.log('Client: client1@example.com / password123');
        console.log('Admin: admin@example.com / password123');

        await client.end();
        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
        await client.end();
        throw error; // Re-throw to be caught by the start script
    }
}

// Allow script to be imported without immediate execution
if (require.main === module) {
    seed().catch((error) => {
        console.error('Seed script failed:', error);
        process.exit(1);
    });
}

export default seed; 