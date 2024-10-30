#!/bin/sh

# Wait for database to be ready
echo "Waiting for database..."
sleep 10

# Check if users table is empty
USER_COUNT=$(psql -h db -U user -d trainright -t -c "SELECT COUNT(*) FROM users;")

# If no users exist, run the seed script
if [ "$USER_COUNT" = " 0" ] || [ -z "$USER_COUNT" ]; then
    echo "Database is empty. Running seed script..."
    npx ts-node src/scripts/seed.ts
else
    echo "Database already has data. Skipping seed."
fi

# Start the application
npm run dev 