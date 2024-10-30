# TrainRight - Fitness Training Management Platform

## Overview
TrainRight is a web application that connects personal trainers with their clients, facilitating workout management, progress tracking, and communication.

## Project Structure
```
frontend/
├── src/                    # Source files
│   ├── pages/             # Next.js pages
│   ├── components/        # React components
│   ├── styles/           # CSS styles
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript types
│   ├── middleware/       # Middleware functions
│   └── config/           # Configuration files
├── public/               # Static files
├── scripts/             # Build and utility scripts
└── tests/               # Test files
```

## Features
- 🔐 Authentication & Authorization
- 👥 Client-Trainer Relationship Management
- 💪 Workout Creation and Assignment
- 📊 Progress Tracking
- 📱 Responsive Design

## Tech Stack
- Next.js
- TypeScript
- NextAuth.js
- Axios
- Docker

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- Docker and Docker Compose
- npm or yarn

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/trainright.git
cd trainright
```

2. Install dependencies:
```bash
cd frontend
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration.

4. Run with Docker:
```bash
docker-compose up
```

Or run locally:
```bash
npm run dev
```

### Development URLs
- Frontend: http://localhost:3000
- API: http://localhost:8000

### Test Accounts
```
Trainer:
Email: trainer@example.com
Password: password123

Client:
Email: client1@example.com
Password: password123
```

## Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run linting
npm run lint

# Organize project files
npm run organize
```

## Contributing
1. Create a feature branch
2. Make your changes
3. Submit a pull request

## Project Status
🚧 Under active development

## License
MIT License - see LICENSE file for details
