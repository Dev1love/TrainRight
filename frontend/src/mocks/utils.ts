import { mockExercises, mockWorkoutTemplates } from './data';
import type { Exercise, WorkoutTemplate } from './types';

export const mockDataUtils = {
  exercises: {
    getAll: () => mockExercises,
    getById: (id: string) => mockExercises.find(ex => ex.id === id),
    getByCategory: (category: string) => 
      mockExercises.filter(ex => ex.category === category),
  },
  workouts: {
    getAll: () => mockWorkoutTemplates,
    getById: (id: string) => 
      mockWorkoutTemplates.find(template => template.id === id),
    getByDifficulty: (difficulty: string) =>
      mockWorkoutTemplates.filter(template => template.difficulty === difficulty),
  },
  // Add more utility functions as needed
}; 