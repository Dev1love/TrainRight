import { 
  Exercise, 
  WorkoutTemplate, 
  WorkoutProgress,
  Notification,
  ScheduledWorkout 
} from './types';

// Static data
export const exerciseCategories = [
  'Strength',
  'Cardio',
  'Flexibility',
  'Balance',
  'Core',
  'Olympic',
  'Bodyweight',
  'Recovery'
] as const;

export const difficultyLevels = [
  'beginner',
  'intermediate',
  'advanced'
] as const;

export const workoutTypes = [
  'strength',
  'cardio',
  'flexibility',
  'hybrid'
] as const;

// Mock data
export const mockExercises: Exercise[] = [
  {
    id: 'e1',
    name: 'Barbell Back Squat',
    category: 'Strength',
    description: 'A compound exercise targeting the lower body muscles',
    difficulty: 'intermediate',
    equipment: ['Barbell', 'Squat Rack'],
    muscles: ['Quadriceps', 'Hamstrings', 'Glutes', 'Core'],
    sets: 4,
    reps: 8,
    restTime: 90,
    instructions: [
      'Position the barbell on your upper back',
      'Stand with feet shoulder-width apart',
      'Bend knees and hips to squat down',
      'Keep chest up and back straight',
      'Return to starting position'
    ]
  },
  {
    id: 'e2',
    name: 'Bench Press',
    category: 'Strength',
    description: 'Classic chest exercise for upper body strength',
    difficulty: 'intermediate',
    equipment: ['Barbell', 'Bench'],
    muscles: ['Chest', 'Shoulders', 'Triceps'],
    sets: 4,
    reps: 8,
    restTime: 90,
    instructions: [
      'Lie on bench with feet flat on ground',
      'Grip barbell slightly wider than shoulders',
      'Lower bar to chest with control',
      'Press bar up to starting position'
    ]
  },
  {
    id: 'e3',
    name: 'Deadlift',
    category: 'Strength',
    description: 'Compound movement for total body strength',
    difficulty: 'advanced',
    equipment: ['Barbell'],
    muscles: ['Back', 'Hamstrings', 'Glutes', 'Core'],
    sets: 3,
    reps: 6,
    restTime: 120,
    instructions: [
      'Stand with feet hip-width apart',
      'Bend at hips and knees to grip bar',
      'Keep back straight and chest up',
      'Lift bar by extending hips and knees'
    ]
  }
];

export const mockWorkoutTemplates: WorkoutTemplate[] = [
  {
    id: '1',
    name: 'Full Body Strength',
    description: 'Complete full body workout focusing on major muscle groups',
    difficulty: 'intermediate',
    duration: 60,
    category: 'Strength',
    exercises: mockExercises.slice(0, 3),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Upper Body Focus',
    description: 'Intensive upper body workout targeting chest, shoulders, and arms',
    difficulty: 'intermediate',
    duration: 45,
    category: 'Strength',
    exercises: [mockExercises[1]], // Bench press
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Lower Body Power',
    description: 'Build leg strength and power with these compound movements',
    difficulty: 'advanced',
    duration: 50,
    category: 'Strength',
    exercises: [mockExercises[0]], // Squats
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Add utility functions
export const mockDataUtils = {
  workouts: {
    getAll: () => mockWorkoutTemplates,
    getById: (id: string) => mockWorkoutTemplates.find(w => w.id === id),
    getByDifficulty: (difficulty: string) => 
      mockWorkoutTemplates.filter(w => w.difficulty === difficulty),
    getByCategory: (category: string) =>
      mockWorkoutTemplates.filter(w => w.category === category)
  },
  exercises: {
    getAll: () => mockExercises,
    getById: (id: string) => mockExercises.find(e => e.id === id),
    getByCategory: (category: string) =>
      mockExercises.filter(e => e.category === category),
    getByDifficulty: (difficulty: string) =>
      mockExercises.filter(e => e.difficulty === difficulty)
  }
};

// Add categories and other static data
export const workoutCategories = [
  'Strength',
  'Cardio',
  'HIIT',
  'Flexibility',
  'Recovery'
] as const;

export const difficultyLevels = [
  'beginner',
  'intermediate',
  'advanced'
] as const;

// Add scheduled workouts data
export const mockScheduledWorkouts: ScheduledWorkout[] = [
  {
    id: '1',
    title: 'Full Body Strength Training',
    date: new Date('2024-03-15'),
    startTime: '09:00',
    duration: 60,
    type: 'personal',
    status: 'scheduled',
    trainer: {
      id: 't1',
      name: 'John Trainer'
    },
    client: {
      id: 'c1',
      name: 'Jane Client'
    },
    notes: 'Focus on proper form'
  },
  {
    id: '2',
    title: 'HIIT Session',
    date: new Date('2024-03-16'),
    startTime: '14:00',
    duration: 45,
    type: 'group',
    status: 'scheduled',
    trainer: {
      id: 't1',
      name: 'John Trainer'
    }
  }
];

// Add workout progress data
export const mockWorkoutProgress: WorkoutProgress[] = [
  {
    id: '1',
    date: new Date('2024-03-01'),
    workoutName: 'Full Body Strength',
    duration: 65,
    mood: 4,
    notes: 'Felt strong today, increased weights on squats',
    exercises: [
      {
        id: 'ep1',
        exerciseName: 'Barbell Squats',
        sets: [
          { weight: 135, reps: 10, completed: true },
          { weight: 155, reps: 8, completed: true },
          { weight: 175, reps: 6, completed: true }
        ],
        notes: 'Form felt solid, ready to increase weight next session'
      },
      {
        id: 'ep2',
        exerciseName: 'Bench Press',
        sets: [
          { weight: 145, reps: 8, completed: true },
          { weight: 145, reps: 8, completed: true },
          { weight: 145, reps: 6, completed: true }
        ]
      }
    ]
  }
];

// Add notifications data
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: 'New Workout Plan',
    message: 'Your trainer has assigned you a new workout plan.',
    date: new Date('2024-03-10T10:00:00'),
    read: false,
    actionUrl: '/workouts/plans',
    actionText: 'View Plan'
  },
  {
    id: '2',
    type: 'success',
    title: 'Workout Completed',
    message: 'Great job! You completed your workout session.',
    date: new Date('2024-03-09T16:30:00'),
    read: true
  }
];

// Expand utility functions
export const mockDataUtils = {
  workouts: {
    getAll: () => mockWorkoutTemplates,
    getById: (id: string) => mockWorkoutTemplates.find(w => w.id === id),
    getByDifficulty: (difficulty: string) => 
      mockWorkoutTemplates.filter(w => w.difficulty === difficulty),
    getByCategory: (category: string) =>
      mockWorkoutTemplates.filter(w => w.category === category)
  },
  exercises: {
    getAll: () => mockExercises,
    getById: (id: string) => mockExercises.find(e => e.id === id),
    getByCategory: (category: string) =>
      mockExercises.filter(e => e.category === category),
    getByDifficulty: (difficulty: string) =>
      mockExercises.filter(e => e.difficulty === difficulty)
  },
  schedule: {
    getAll: () => mockScheduledWorkouts,
    getById: (id: string) => mockScheduledWorkouts.find(s => s.id === id),
    getByDate: (date: Date) => 
      mockScheduledWorkouts.filter(s => 
        s.date.toDateString() === date.toDateString()
      ),
    getByTrainer: (trainerId: string) =>
      mockScheduledWorkouts.filter(s => s.trainer?.id === trainerId),
    getByClient: (clientId: string) =>
      mockScheduledWorkouts.filter(s => s.client?.id === clientId)
  },
  progress: {
    getAll: () => mockWorkoutProgress,
    getById: (id: string) => mockWorkoutProgress.find(p => p.id === id),
    getByDateRange: (startDate: Date, endDate: Date) =>
      mockWorkoutProgress.filter(p => 
        p.date >= startDate && p.date <= endDate
      )
  },
  notifications: {
    getAll: () => mockNotifications,
    getUnread: () => mockNotifications.filter(n => !n.read),
    getByType: (type: string) => 
      mockNotifications.filter(n => n.type === type)
  }
};

// Add more static data
export const workoutTypes = [
  'personal',
  'group',
  'virtual'
] as const;

export const exerciseEquipment = [
  'Barbell',
  'Dumbbell',
  'Kettlebell',
  'Resistance Bands',
  'Bodyweight',
  'Machine',
  'Cable',
  'Other'
] as const;

export const targetMuscles = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Legs',
  'Core',
  'Full Body'
] as const;

export const workoutStatus = [
  'scheduled',
  'completed',
  'cancelled'
] as const;