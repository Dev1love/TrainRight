export const mockWorkout = {
  id: '1',
  title: 'Full Body Workout',
  exercises: [
    { name: 'Squats', sets: 3, reps: 12 },
    { name: 'Push-ups', sets: 3, reps: 15 },
    { name: 'Pull-ups', sets: 3, reps: 8 }
  ],
  duration: '45 minutes',
  difficulty: 'intermediate'
};

export const mockUser = {
  id: '1',
  email: 'test@example.com',
  role: 'CLIENT' as const,
  name: 'Test User'
}; 