import type { User, WorkoutData, ClientData } from '@/types/auth';

export const mockUsers: Record<string, User> = {
  trainer: {
    id: '1',
    email: 'trainer@example.com',
    role: 'TRAINER',
    name: 'Mock Trainer',
  },
  client: {
    id: '2',
    email: 'client@example.com',
    role: 'CLIENT',
    name: 'Mock Client',
  },
};

export const mockWorkouts: WorkoutData[] = [
  {
    id: '1',
    title: 'Full Body Workout',
    description: 'Complete full body workout',
    difficulty: 'intermediate',
    duration: '45 minutes',
    exercises: [
      { name: 'Squats', sets: 3, reps: 12 },
      { name: 'Push-ups', sets: 3, reps: 15 },
    ],
    createdBy: mockUsers.trainer.id,
    createdAt: new Date().toISOString(),
  },
  // Add more mock workouts...
];

export const mockClients: ClientData[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    lastActive: new Date().toISOString(),
    assignedWorkouts: 5,
    completedWorkouts: 3,
  },
  // Add more mock clients...
]; 