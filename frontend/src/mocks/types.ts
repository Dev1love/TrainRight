// Common types used across mock data
export interface Exercise {
  id: string;
  name: string;
  category: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  muscles: string[];
  videoUrl?: string;
  instructions: string[];
  sets?: number;
  reps?: number;
  restTime?: number;
  notes?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutProgress {
  id: string;
  date: Date;
  workoutName: string;
  exercises: ExerciseProgress[];
  notes: string;
  mood: 1 | 2 | 3 | 4 | 5;
  duration: number;
}

export interface ExerciseProgress {
  id: string;
  exerciseName: string;
  sets: {
    weight: number;
    reps: number;
    completed: boolean;
  }[];
  notes?: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  date: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

export interface ScheduledWorkout {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  duration: number;
  type: 'personal' | 'group' | 'virtual';
  status: 'scheduled' | 'completed' | 'cancelled';
  trainer?: {
    id: string;
    name: string;
  };
  client?: {
    id: string;
    name: string;
  };
  notes?: string;
} 