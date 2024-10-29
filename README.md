# TrainRight - Fitness Training Management System

## About
TrainRight is a comprehensive fitness training management system that connects trainers with clients, manages workout plans, and tracks training progress. The application is built with TypeScript, Express.js, and PostgreSQL, following clean architecture principles and test-driven development practices.

## Database Structure
The system uses PostgreSQL with the following main entities:

### Core Entities:
- **Users**
  - Roles: Client, Trainer, Admin
  - Authentication & Authorization
  - Profile management

- **Training Plans**
  - Created by trainers
  - Contains ordered exercises
  - Customizable sets, reps, and recommendations

- **Exercises**
  - Exercise library
  - Details including descriptions and video URLs
  - Rest time recommendations

- **Workouts**
  - Client workout sessions
  - Progress tracking
  - Status management (in-progress/completed)

### Relationship Entities:
- **Trainer-Client Relationships**
  - Manages trainer-client assignments
  - Status tracking (pending/active/terminated)

- **Plan Exercises**
  - Links exercises to training plans
  - Defines exercise order and requirements

- **Workout Progress**
  - Tracks exercise completion
  - Records weights, sets, and reps
  - Stores performance notes

- **Feedback**
  - Workout session feedback
  - Communication between trainers and clients

## Implemented Features

### Authentication & Authorization
- ✅ User registration with role selection
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Secure password handling

### Trainer Features
- ✅ Client management
- ✅ Training plan creation
- ✅ Exercise management
- ✅ Client progress monitoring

### Client Features
- ✅ Workout session management
- ✅ Progress tracking
- ✅ Training plan access
- ✅ Workout history

### System Features
- ✅ Database backup/restore
- ✅ Data seeding for testing
- ✅ Swagger API documentation
- ✅ Error handling middleware
- ✅ TypeScript type safety

## ToDo Features

### High Priority
1. Implement WorkoutProgress functionality
2. Add exercise categorization
3. Add workout templates
4. Implement notification system

### Medium Priority
1. Add workout scheduling
2. Implement progress analytics
3. Add file upload for exercise videos
4. Create mobile-responsive frontend

### Low Priority
1. Add social features
2. Implement chat system
3. Add payment integration
4. Create subscription plans

## Setup and Installation

### Running Locally
1. Install dependencies: 
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

3. Create database:
   ```bash
   createdb trainright
   ```

4. Run migrations and seed data:
   ```bash
   npm run seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Running with Docker

1. Make sure Docker and Docker Compose are installed on your system.

2. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

3. Seed the database (in a separate terminal):
   ```bash
   docker exec -it trainright-app-1 npm run seed
   ```

4. Access the application:
   - API: http://localhost:3000
   - API Documentation: http://localhost:3000/api-docs

### Test Users
After seeding, you can use these credentials:
- Trainer: trainer@example.com / password123
- Client: client1@example.com / password123
- Admin: admin@example.com / password123

## Running with Docker Compose

To start the application using Docker Compose:

1. Run the following command:
  ```bash
  docker-compose up
  ```

This will build the image and start the container as defined in the `docker-compose.yml` file.

## API Documentation
Full API documentation is available through Swagger UI at `/api-docs` when running the server.

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
[MIT License](LICENSE)

